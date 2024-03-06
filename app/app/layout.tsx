'use client'
import SideNav from '@/app/ui/app/sidenav';
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
 
function Layout({ children  }:  { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
     
        {children}</div>
    </div>
  );
}

export default withAuthenticator(Layout);