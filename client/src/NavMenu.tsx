import React from 'react';
import { Link } from 'wouter';
import {
  BookUser,
  Building2,
  CalendarClock,
  CircleX,
  Edit,
  Home,
  RouteIcon,
  TestTube,
  User2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';

const NavMenu: React.FC = () => {
  const StyledLink = (props: any) => {
    return (
      <Link
        href={props.href}
        className={
          window.location.pathname === props.href
            ? 'flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground md:h-10 md:w-10'
            : 'flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground md:h-10 md:w-10'
        }
      >
        {props.children}
      </Link>
    );
  };

  return (
    <div className="flex h-screen w-14 min-w-14 bg-secondary">
      <nav className="flex flex-grow flex-col items-center justify-between">
        <TooltipProvider>
          <div className="flex flex-col items-center space-y-4 pt-3">
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/">
                  <Home className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/personnel">
                  <BookUser className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Personnel</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/rooms">
                  <Building2 className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Rooms</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/stage-editor">
                  <Edit className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Stage Editor</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/pathway-editor">
                  <RouteIcon className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Pathway Editor</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/calendar">
                  <CalendarClock className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Calendar</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/conflict">
                  <CircleX className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Conflict Manager</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/test">
                  <TestTube className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p>Test</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center space-y-4 pb-3">
            <Tooltip>
              <TooltipTrigger>
                <StyledLink href="/account">
                  <User2 className="h-7 w-7" />
                </StyledLink>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={15}>
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default NavMenu;
