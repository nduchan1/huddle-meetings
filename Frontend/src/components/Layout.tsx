import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { BrandMark } from './BrandMark'
import { GitHubIcon } from './Icons'

const navClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'nav__link is-active' : 'nav__link')

/** The meetings list and the edit page belong to "Meetings"; the create page has its own link. */
function isMeetingsRoute(pathname: string): boolean {
  return pathname.startsWith('/meetings') && !pathname.startsWith('/meetings/new')
}

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="site">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="Huddle home">
            <BrandMark />
            <span>Huddle</span>
          </Link>
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>
            <NavLink to="/meetings" className={() => navClass({ isActive: isMeetingsRoute(pathname) })}>
              Meetings
            </NavLink>
            <NavLink to="/meetings/new" className={navClass}>
              New Meeting
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <p>© 2026 Nitai Duchan · Full Stack Web Development Course, John Bryce</p>
          <a className="site-footer__link" href="https://github.com/nduchan1" target="_blank" rel="noreferrer">
            <GitHubIcon size={18} />
            github.com/nduchan1
          </a>
        </div>
      </footer>
    </div>
  )
}
