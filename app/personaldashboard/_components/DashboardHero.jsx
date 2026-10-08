// 📁 app/personaldashboard/_components/DashboardHero.jsx
// Personal Dashboard hero with navigation links to /personaldashboard routes
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/site';
import { Home, BarChart2, PieChart, Grid, Activity, FolderOpen } from 'lucide-react';
import { licenseCheck } from '@/lib/helpers/customfunctions';

const DashboardHero = ({
  heroData,
  token,
  useremail,
}) => {
  const [license, setLicense] = useState(null);
  const [expires, setExpires] = useState(null);

  useEffect(() => {
    const checkLicense = async () => {
      const result = await licenseCheck(useremail, token, API_URL);
      setLicense(result.license);
      setExpires(result.expires);
    };
    checkLicense();
  }, [useremail, token]);

  // Helper: format expiry date consistently
  const formatExpiryDate = (expiresVal) => {
    if (!expiresVal) return 'N/A';
    try {
      const date = new Date(expiresVal);
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    } catch {
      return 'N/A';
    }
  };

  const initialLicense = license;

  const menuItems = [
    { 
      name: "Dashboard Home", 
      icon: <Home size={20} />, 
      link: "/personaldashboard", 
      access: "all" 
    },
    { 
      name: "Project Status Cards", 
      icon: <Grid size={20} />, 
      link: "/personaldashboard/tabular/cardtop", 
      access: ["TBT02", "TBT03", "CBT02", "CBT03"] 
    },
    { 
      name: "Variance Report", 
      icon: <Grid size={20} />, 
      link: "/personaldashboard/tabular/variance", 
      access: ["ABT02", "ABT03"] 
    },
    { 
      name: "Burndown Chart", 
      icon: <Activity size={20} />, 
      link: "/personaldashboard/burndown", 
      access: ["ABT02", "ABT03"] 
    },
    { 
      name: "Resource Graphs", 
      icon: <BarChart2 size={20} />, 
      link: "/personaldashboard/resources", 
      access: ["TBT02", "TBT03", "CBT02", "CBT03"] 
    },
    {
      name: "Charts",
      icon: <PieChart size={20} />,
      link: "/personaldashboard/charts",
      access: ["TBT02", "TBT03", "CBT02", "CBT03"]
    },
    {
      name: "Pubsets",
      icon: <FolderOpen size={20} />,
      link: "/personaldashboard/pubsets",
      access: "all"
    },
  ];

  // Helper function to check if user has access to a menu item
  const hasAccess = (itemAccess) => {
    if (itemAccess === "all") return true;
    if (Array.isArray(itemAccess) && itemAccess.includes(initialLicense)) return true;
    return false;
  };

  return (
    <section className="bg-gradient-to-r from-gray-900 to-blue-900 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-2">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center mb-2 md:mb-0">
            <div className="flex-shrink-0 mr-4">
              <Image
                className="h-16 w-16 rounded-full shadow-lg object-cover"
                src={heroData.bgImageURL}
                width={64}
                height={64}
                alt="Dashboard logo"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white leading-tight">
                {heroData.titleText}
              </h1>
              <p className="text-sm text-blue-300">
                {heroData.sloganText}
              </p>
              {useremail && (
                <p className="text-xs text-blue-200">
                  {useremail}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - License Info */}
          <div className="text-white text-right bg-gray-800 bg-opacity-50 rounded-lg px-3 py-2">
            <div className="space-y-0.5">
              <p className="text-xs text-blue-200">Your License</p>
              <p className="text-sm font-semibold">{license || 'N/A'}</p>
              <p className="text-xs text-blue-200">Expires</p>
              <p className="text-xs">{formatExpiryDate(expires)}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-gray-800 bg-opacity-50 rounded-lg px-3 py-2 mt-1">
          <ul className="flex flex-wrap justify-center gap-2">
            {menuItems
              .filter(item => hasAccess(item.access))
              .map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="flex items-center px-3 py-1.5 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors duration-200 text-white hover:text-white no-underline text-sm"
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))
            }
          </ul>

          {/* No Access Message */}
          {menuItems.filter(item => hasAccess(item.access)).length === 1 && (
            <div className="text-center mt-2 text-blue-200 text-sm">
              <p>Upgrade your license to access more dashboard features</p>
            </div>
          )}
        </nav>
      </div>
    </section>
  );
};

export default DashboardHero;