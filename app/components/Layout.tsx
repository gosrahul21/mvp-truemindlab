import Footer from "./FooterSection";
import NavBar from "./NavBar";
import ScrollProgress from "./ScrollProgress";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Layout({children, showNav = true, showFooter = true}: any) {

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Navigation Bar */}
                {/* Navigation Bar */}
        {showNav && <NavBar/>}
        {children}
        {showFooter && <Footer/>}
      </div>
    </>
  )
}
