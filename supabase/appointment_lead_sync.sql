-- ============================================================
-- Post-Appointment Lead Status Sync
-- Run AFTER leads_appointments.sql
-- ============================================================
-- This trigger fires whenever an appointment's status changes.
-- It syncs the linked lead's status and follow_up_enrolled flag
-- so that campaign and follow-up sequences automatically activate.

CREATE OR REPLACE FUNCTION sync_lead_on_appointment_status_change()
RETURNS trigger AS $$
BEGIN
  -- Only act when status actually changed AND a lead is linked
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  IF NEW.lead_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'completed' THEN
    -- Appointment done → ask for feedback
    -- lead stays as "booked" but follow_up_enrolled → true
    -- so the feedback campaign can pick it up
    UPDATE leads
    SET
      follow_up_enrolled = true,
      updated_at = now()
    WHERE id = NEW.lead_id;

  ELSIF NEW.status = 'no_show' THEN
    -- No-show → re-activate follow-up sequence to reschedule
    UPDATE leads
    SET
      status = 'contacted',       -- revert from booked to contacted
      follow_up_enrolled = true,  -- re-enrol in follow-up drip
      updated_at = now()
    WHERE id = NEW.lead_id;

  ELSIF NEW.status = 'cancelled' THEN
    -- Cancelled → send back to qualified for re-booking
    UPDATE leads
    SET
      status = 'qualified',
      follow_up_enrolled = true,
      updated_at = now()
    WHERE id = NEW.lead_id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_appointment_status_change ON appointments;
CREATE TRIGGER on_appointment_status_change
  AFTER UPDATE OF status ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION sync_lead_on_appointment_status_change();
