import avatar from '../assets/avatar.png'
import { GitHubIcon } from '../components/Icons'
import { PageHeader } from '../components/PageHeader'
import { usePageTitle } from '../hooks/usePageTitle'

const FEATURES = [
  'Lists every development team in the company',
  'Shows the meetings of a team, split into upcoming and past',
  'Displays the start, duration and room of each meeting',
  'Lets you schedule new meetings and update existing ones',
  'Deletes meetings that were cancelled, after a confirmation',
]

const STACK = ['React 19', 'TypeScript', 'React Router', 'Vite', 'CSS', 'Node.js', 'Express 5', 'PostgreSQL (Neon)', 'zod']

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const ENDPOINTS: { method: Method; path: string; summary: string }[] = [
  { method: 'GET', path: '/api/teams', summary: 'all teams' },
  { method: 'GET', path: '/api/teams/:teamId/meetings', summary: 'meetings of a team' },
  { method: 'GET', path: '/api/meetings/:id', summary: 'one meeting' },
  { method: 'POST', path: '/api/meetings', summary: 'create a meeting' },
  { method: 'PUT', path: '/api/meetings/:id', summary: 'update a meeting' },
  { method: 'DELETE', path: '/api/meetings/:id', summary: 'delete a meeting' },
]

export function AboutPage() {
  usePageTitle('About')

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Huddle"
        description="A small client–server application for managing the meetings of development teams."
      />
      <div className="about">
        <article className="card about-card" aria-labelledby="about-huddle">
          <div>
            <h2 id="about-huddle" className="about-card__title">
              The system
            </h2>
            <p className="about-card__text">
              Huddle is a meeting manager for the development teams of a high-tech company. The React front end
              talks to a Node.js API, which stores teams and meetings in a PostgreSQL database, so every change
              is saved and shared straight away.
            </p>
          </div>

          <section aria-labelledby="what-it-does">
            <h3 id="what-it-does" className="about-card__subtitle">
              What it does
            </h3>
            <ul className="bullets">
              {FEATURES.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="built-with">
            <h3 id="built-with" className="about-card__subtitle">
              Built with
            </h3>
            <ul className="chips">
              {STACK.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="api">
            <h3 id="api" className="about-card__subtitle">
              API
            </h3>
            <ul className="api-list">
              {ENDPOINTS.map((endpoint) => (
                <li key={`${endpoint.method} ${endpoint.path}`}>
                  <span className={`method method--${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
                  <code>{endpoint.path}</code>
                  <span className="api-list__summary">{endpoint.summary}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <article className="card about-card profile" aria-labelledby="developer-name">
          <img className="profile__photo" src={avatar} alt="Nitai Duchan" width={128} height={128} />
          <div>
            <h2 id="developer-name" className="profile__name">
              Nitai Duchan
            </h2>
            <p className="profile__role">Full Stack Web Development Student · John Bryce</p>
          </div>
          <p className="profile__bio">
            I'm a full-stack web development student at John Bryce. Huddle is my third course task and my first
            full client–server project: a React front end, a Node.js API and a PostgreSQL database that I designed
            and built end to end.
          </p>
          <a className="profile__link" href="https://github.com/nduchan1" target="_blank" rel="noreferrer">
            <GitHubIcon size={18} />
            github.com/nduchan1
          </a>
        </article>
      </div>
    </>
  )
}
