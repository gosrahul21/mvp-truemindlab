import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

// ENCRYPTION_KEY should be a 32-byte hex string (64 characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_change_me_in_production'

export function encrypt(text: string): string {
  if (!text) return ''
  
  const iv = crypto.randomBytes(IV_LENGTH)
  const salt = crypto.randomBytes(SALT_LENGTH)
  
  // Use PBKDF2 to derive a key from the secret
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512')
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  
  // Return format: salt:iv:tag:encrypted
  return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(encryptedData: string): string {
  if (!encryptedData) return ''
  
  try {
    const [saltHex, ivHex, tagHex, encryptedHex] = encryptedData.split(':')
    
    if (!saltHex || !ivHex || !tagHex || !encryptedHex) {
      // Fallback for non-encrypted data if any legacy data exists
      return encryptedData
    }
    
    const salt = Buffer.from(saltHex, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')
    
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha512')
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)
    
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    
    return decrypted.toString('utf8')
  } catch (err) {
    console.error('Decryption failed:', err)
    return '' // Or return original string if it wasn't encrypted
  }
}
