import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <img 
                src="/logo.svg" 
                alt="SlideAura" 
                className="w-8 h-8"
              />
              <span className="font-display font-bold text-xl text-[#fafafa]">
                SlideAura
              </span>
            </Link>
            <p className="text-sm text-[#a0a0a0] max-w-xs">
              AI-powered presentation platform for modern professionals.
            </p>
          </div>

          {/* Essential Links */}
          <div className="flex gap-12">
            <div>
              <h3 className="font-semibold text-[#fafafa] mb-3 text-sm">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/workspace/pricing" className="text-sm text-[#a0a0a0] hover:text-[#8b5cf6] transition-colors">Pricing</Link></li>
                <li><Link to="/workspace" className="text-sm text-[#a0a0a0] hover:text-[#8b5cf6] transition-colors">Workspace</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#2a2a2a]">
          <p className="text-xs text-[#808080] font-mono">
            © {new Date().getFullYear()} SlideAura. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
