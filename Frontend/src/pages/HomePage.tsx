import heroIllustration from '../assets/hero.svg'
import { Button } from '../components/Button'
import { ArrowRightIcon, CalendarIcon, PinIcon, PlusIcon, UsersIcon } from '../components/Icons'
import { usePageTitle } from '../hooks/usePageTitle'

export function HomePage() {
  usePageTitle()

  return (
    <>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Meetings for development teams</p>
          <h1 className="hero__title">Every team meeting, in one place</h1>
          <p className="hero__text">
            Huddle keeps the meetings of every development team in the company together. Browse a team's
            meetings, see when each one starts, how long it runs and which room it is in, and add, update or
            delete meetings as plans change.
          </p>
          <div className="hero__actions">
            <Button to="/meetings" trailingIcon={<ArrowRightIcon />}>
              Browse meetings
            </Button>
            <Button to="/meetings/new" variant="secondary" icon={<PlusIcon />}>
              Schedule a meeting
            </Button>
          </div>
        </div>
        <img
          className="hero__art"
          src={heroIllustration}
          alt="Illustration of a team calendar with upcoming meetings in orange and past meetings in green"
          width={640}
          height={480}
        />
      </section>

      <section className="features" aria-label="What Huddle offers">
        <article className="card feature">
          <div className="feature__icon">
            <UsersIcon size={22} />
          </div>
          <h2 className="feature__title">Browse by team</h2>
          <p className="feature__text">Pick a development team and see all of its meetings, sorted by start time.</p>
        </article>
        <article className="card feature">
          <div className="feature__icon feature__icon--upcoming">
            <CalendarIcon size={22} />
          </div>
          <h2 className="feature__title">Never miss the start</h2>
          <p className="feature__text">
            Meetings still ahead are marked in orange; meetings that already started are marked in green.
          </p>
        </article>
        <article className="card feature">
          <div className="feature__icon feature__icon--accent">
            <PinIcon size={22} />
          </div>
          <h2 className="feature__title">Rooms and durations at a glance</h2>
          <p className="feature__text">
            Every meeting card shows the room and how long the meeting runs, from a quick 45m sync to a 3h
            workshop.
          </p>
        </article>
      </section>
    </>
  )
}
