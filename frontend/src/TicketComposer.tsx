import {useState,type FormEvent} from 'react';
import {createTicket,type Ticket} from './api';

/** Maximum number of characters allowed in a ticket title, mirrored from the backend validation. */
const TITLE_LIMIT = 180;

/**
 * Composer form for creating a new support ticket.
 *
 * Displays a live character count (e.g. "12 / 180") next to the title field so
 * requesters can see how much room remains before hitting the existing
 * 180-character backend limit. The count updates on every keystroke, resets
 * to "0 / 180" once a ticket is successfully created, and is preserved
 * alongside the entered title if submission fails so the requester can retry.
 */
export function TicketComposer({onCreated}:{onCreated:(ticket:Ticket)=>void}){
  const [title,setTitle]=useState('');
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);

  async function submit(event:FormEvent){
    event.preventDefault();
    setSaving(true);
    setError('');
    try{
      const ticket=await createTicket(title);
      onCreated(ticket);
      // Clear the title (and, by extension, reset the character count) only
      // after a successful creation so failed submissions retain the input.
      setTitle('');
    }catch(e){
      setError(e instanceof Error?e.message:'Unable to create ticket');
    }finally{
      setSaving(false);
    }
  }

  return <form className="composer" onSubmit={event=>void submit(event)}>
    <label htmlFor="ticket-title">New ticket</label>
    <div>
      <input
        id="ticket-title"
        value={title}
        maxLength={TITLE_LIMIT}
        required
        onChange={event=>setTitle(event.target.value)}
        placeholder="Describe the customer issue"
        aria-describedby="ticket-title-count"
      />
      <button disabled={saving}>{saving?'Creating...':'Create'}</button>
    </div>
    <span id="ticket-title-count" className="title-count">{title.length} / {TITLE_LIMIT}</span>
    {error&&<p role="alert">{error}</p>}
  </form>;
}
