import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { AssignmentPanel } from "./AssignmentPanel";
import { TicketComposer } from "./TicketComposer";
import favicon from "./favicon.png";
import {
  loadWorkspace,
  type Ticket,
  type Member,
  type AuditEvent,
} from "./api";
import "./styles.css";

function App() {
  const [data, setData] = useState<{
    tickets: Ticket[];
    members: Member[];
    audits: AuditEvent[];
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void loadWorkspace()
      .then(setData)
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Unable to load workspace"),
      );
  }, []);
  if (error)
    return (
      <main>
        <p role="alert">{error}</p>
      </main>
    );
  if (!data)
    return (
      <main>
        <p className="loading">Loading Ticketly support workspace...</p>
      </main>
    );
  const ticket = data.tickets[0];
  return (
    <main>
      <header>
        <div>
          <a className="brand" href="/">
            <img src={favicon} alt="" />
            <span>Ticketly</span>
          </a>
          <strong className="header-context">Customer support workspace</strong>
        </div>
        <span className="badge">Local demo · API healthy</span>
      </header>
      <section className="hero">
        <div>
          <p className="eyebrow">Acme Corp · Support desk</p>
          <h1>Tickets that stay with your team.</h1>
          <p>
            Create tickets, assign teammates, and retain an audit trail for
            every assignment.
          </p>
        </div>
      </section>
      <section className="desk">
        <aside>
          <p className="eyebrow">Tickets</p>
          <TicketComposer
            onCreated={(newTicket) =>
              setData((current) =>
                current
                  ? { ...current, tickets: [...current.tickets, newTicket] }
                  : current,
              )
            }
          />
          {data.tickets.map((item) => (
            <button className="ticket" key={item.id}>
              <b>{item.id}</b>
              <span>{item.title}</span>
              <em>{item.status}</em>
            </button>
          ))}
        </aside>
        <div>
          <AssignmentPanel initialTicket={ticket} members={data.members} />
          <Audit events={data.audits} />
        </div>
      </section>
    </main>
  );
}
function Audit({ events }: { events: AuditEvent[] }) {
  return (
    <section className="panel">
      <h2>Assignment audit</h2>
      {events.length ? (
        events.map((event) => (
          <div className="row" key={event.occurredAt}>
            <span className="dot" />
            <div>
              <b>{event.action.replaceAll("_", " ")}</b>
              <small>
                {event.actorId} assigned {event.assigneeId}
              </small>
            </div>
            <small>{new Date(event.occurredAt).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No assignment events yet—make one above.</p>
      )}
    </section>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
