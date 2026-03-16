import { Link } from '@tanstack/react-router';
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { useContext } from 'react';
import { FaMagnifyingGlassChart, FaRobot } from 'react-icons/fa6';
import { ConfigContext } from '../config/config-factory';
import { NavigationArea, useNavigationStore } from '../store/navigation-store';

export default function LayoutMenu() {
  const { activeArea, setActiveArea } = useNavigationStore();
  const config = useContext(ConfigContext);

  return (
    <Navbar fluid rounded className="bg-mauve-200">
      <NavbarBrand>
        <div>
          <img
            src="/servisbot-logo.png"
            className="w-50 h-12 object-scale-down md:object-contain"
            alt="ServisBot Logo"
          />
          <div className="flex ml-0 sm:text-normal text-sm font-bold uppercase">
            Environment : {config.deploymentType}
          </div>
        </div>
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
