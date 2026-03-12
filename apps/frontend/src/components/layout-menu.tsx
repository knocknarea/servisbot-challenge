import { Link } from '@tanstack/react-router';
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { FaMagnifyingGlassChart, FaRobot } from 'react-icons/fa6';
import { NavigationArea, useNavigationStore } from '../store/navigation-store';

export default function LayoutMenu() {
  const { activeArea, setActiveArea } = useNavigationStore();

  return (
    <Navbar fluid rounded className="bg-mauve-200">
      <NavbarBrand>
        <img
          src="/servisbot-logo.png"
          className="w-50 h-12 object-scale-down md:object-contain"
          alt="ServisBot Logo"
        />
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink
          id="home"
          as={Link}
          href="/"
          active={activeArea === NavigationArea.HOME}
          onClick={() => setActiveArea(NavigationArea.HOME)}
        >
          Home
        </NavbarLink>
        <NavbarLink
          id="bots"
          as={Link}
          href="/bots"
          active={activeArea === NavigationArea.BOTS}
          onClick={() => setActiveArea(NavigationArea.BOTS)}
        >
          <span className="inline-flex">
            <FaRobot className="mr-1 mt-0.5" /> Bots
          </span>
        </NavbarLink>
        <NavbarLink
          id="logs"
          as={Link}
          href="/logs"
          active={activeArea === NavigationArea.LOGS}
          onClick={() => setActiveArea(NavigationArea.LOGS)}
        >
          <span className="inline-flex">
            <FaMagnifyingGlassChart className="mr-1 mt-0.5" />
            Logs
          </span>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
