import React from 'react';
import {
  FiGrid,
  FiCalendar
} from "react-icons/fi";
import { 
  FaGoogle, 
  FaInstagram, 
  FaFacebook 
} from "react-icons/fa";

export const MarketingNav = {
  title: "MARKETING",
  sections: [
    {
      title: "PLATAFORMAS",
      items: [
        {
          id: "google",
          icon: <FaGoogle />,
          label: "Google",
          path: "/marketing/google",
          submenu: [
            {
              id: "google-dashboard",
              icon: <FiGrid />,
              label: "Dashboard",
              path: "/marketing/google/dashboard"
            },
            {
              id: "google-preencher",
              icon: <FiCalendar />,
              label: "Preencher Semana",
              path: "/marketing/google/preencher-semana"
            }
          ]
        },
        {
          id: "instagram",
          icon: <FaInstagram />,
          label: "Instagram",
          path: "/marketing/instagram",
          submenu: [
            {
              id: "instagram-dashboard",
              icon: <FiGrid />,
              label: "Dashboard",
              path: "/marketing/instagram/dashboard"
            },
            {
              id: "instagram-preencher",
              icon: <FiCalendar />,
              label: "Preencher Semana",
              path: "/marketing/instagram/preencher-semana"
            }
          ]
        },
        {
          id: "facebook",
          icon: <FaFacebook />,
          label: "Facebook",
          path: "/marketing/facebook",
          submenu: [
            {
              id: "facebook-dashboard",
              icon: <FiGrid />,
              label: "Dashboard",
              path: "/marketing/facebook/dashboard"
            },
            {
              id: "facebook-preencher",
              icon: <FiCalendar />,
              label: "Preencher Semana",
              path: "/marketing/facebook/preencher-semana"
            }
          ]
        }
      ]
    }
  ]
}; 