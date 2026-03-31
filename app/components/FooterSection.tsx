const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="font-bold text-white text-xl">CF</span>
              </div>
              <span className="text-2xl font-semibold tracking-tighter text-white">CloseFlow AI</span>
            </div>
            
            <p className="max-w-md text-[15px] leading-relaxed text-zinc-500">
              AI-powered lead follow-up that qualifies prospects, handles objections, 
              and books meetings — completely on autopilot.
            </p>

            <div className="flex gap-6 mt-10">
              <a href="#" className="hover:text-white transition-colors">𝕏</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">YouTube</a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-medium mb-5 text-sm tracking-widest">PRODUCT</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-5 text-sm tracking-widest">COMPANY</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-5 text-sm tracking-widest">LEGAL</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security & Compliance</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div>
            © 2026 CloseFlow AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span>Made with ❤️ for sales teams</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;