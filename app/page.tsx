
import HeroSection from './components/HeroSection'
import SocialProof from './components/SocialProof'
import ProblemSection from './components/ProblemSection'
import KeyFeatures from './components/KeyFeatures'
import BenefitsSection from './components/BenefitsSection'
import Footer from './components/FooterSection'
import FaqSection from './components/FAQSection'
import PricingSection from './components/PricingSection'
import TestimonialsSection from './components/TestimonialsSection'
import HowItWorks from './components/HowItWorks'
import Layout from './components/Layout'
import SolutionSection from './components/SolutionSection'


export default function Home() {

  return (
    <Layout>
        {/* Hero Section */}
        <HeroSection/>

        {/* Social Proof / Trust Bar */}
        <SocialProof/>

        {/* Problem Section */}
        <ProblemSection/>
        <SolutionSection/>

        {/* Solution / How CloseFlow AI Works */}
        <HowItWorks/>
        {/* Key Features */}
        <KeyFeatures/>

        {/* Benefits / Outcomes */}
        <BenefitsSection/>

        {/* Demo / Product Screenshot Section */}
        {/* <DemoSection/> */}
        {/* Testimonials / Case Studies */}
        <TestimonialsSection/>

        <PricingSection/>

        <FaqSection/>

    </Layout>
  )
}
