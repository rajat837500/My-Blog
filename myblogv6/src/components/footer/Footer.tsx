import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../index";

// Define Type for Footer Links
interface FooterSection {
  title: string;
  links: string[];
}

// Footer links data
const footerLinks: FooterSection[] = [
  {
    title: "Company",
    links: ["Features", "Pricing", "Affiliate Program", "Press Kit"],
  },
  {
    title: "Support",
    links: ["Account", "Help", "Contact Us", "Customer Support"],
  },
  {
    title: "Legals",
    links: ["Terms & Conditions", "Privacy Policy", "Licensing"],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between">
        {/* Left Section: Logo and Copyright */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <Logo width="50px" />
          <p className="text-xs text-gray-400 mt-2">
            &copy; {new Date().getFullYear()} DevUI. All Rights Reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className="w-full md:w-2/3 flex flex-wrap justify-end">
          {footerLinks.map((section, index) => (
            <div key={index} className="w-1/3 text-center">
              <h3 className="tracking-px mb-2 text-xs font-semibold uppercase text-gray-400">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link, i) => (
                  <li key={i} className="text-sm text-gray-300 hover:text-white transition">
                    <Link to="/">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;



// import React from "react";
// import { Link } from "react-router-dom";
// import Logo from "../Logo";
// import { Theme } from "../Index";

// const footerLinks = [
//   {
//     title: "Company",
//     links: ["Features", "Pricing", "Affiliate Program", "Press Kit"],
//   },
//   {
//     title: "Support",
//     links: ["Account", "Help", "Contact Us", "Customer Support"],
//   },
//   {
//     title: "Legals",
//     links: ["Terms & Conditions", "Privacy Policy", "Licensing"],
//   },
// ];

// function Footer() {
//   return (

//     <footer className="w-full py-4">
//     {/* // <footer className="w-full bg-gray-900 py-4"> */}
//       <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between">
//         {/* Left Section: Logo and Copyright */}
//         <div className="w-full md:w-1/3 text-center md:text-left">
//           <Logo width="50px" />
//           <p className="text-xs text-gray-400 mt-2">
//             &copy; {new Date().getFullYear()} DevUI. All Rights Reserved.
//           </p>
//         </div>
      
//         {/* Footer Links */}
//         <div className="w-full md:w-2/3 flex flex-wrap justify-end">
//           {footerLinks.map((section, index) => (
//             <div key={index} className="w-1/3 text-center">
//               <h3 className="tracking-px mb-2 text-xs font-semibold uppercase text-gray-400">
//                 {section.title}
//               </h3>
//               <ul>
//                 {section.links.map((link, i) => (
//                   <li key={i} className="text-sm text-gray-300 hover:text-white transition">
//                     <Link to="/">{link}</Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>
//     </footer>


//     // <footer className="w-full bg-gray-900 py-4">
//     //   <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between">
//     //     {/* Left Section: Logo and Copyright */}
//     //     <div className="w-full md:w-1/3 text-center md:text-left">
//     //       <Logo width="50px" />
//     //       <p className="text-xs text-gray-600 mt-2">
//     //         &copy; {new Date().getFullYear()} DevUI. All Rights Reserved.
//     //       </p>
//     //     </div>

//     //     {/* Footer Links */}
//     //     <div className="w-full md:w-2/3 flex flex-wrap justify-end">
//     //       {footerLinks.map((section, index) => (
//     //         <div key={index} className="w-1/3 text-center">
//     //           <h3 className="tracking-px mb-2 text-xs font-semibold uppercase text-gray-500">
//     //             {section.title}
//     //           </h3>
//     //           <ul>
//     //             {section.links.map((link, i) => (
//     //               <li key={i} className="text-sm text-gray-900 hover:text-gray-700">
//     //                 <Link to="/">{link}</Link>
//     //               </li>
//     //             ))}
//     //           </ul>
//     //         </div>
//     //       ))}
//     //     </div>
//     //   </div>
//     // </footer>
//   );
// }

// export default Footer;