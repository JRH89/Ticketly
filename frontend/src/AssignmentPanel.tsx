import {useState} from 'react'; import {assignTicket,type Member,type Ticket} from './api';
export function AssignmentPanel({initialTicket,members}:{initialTicket:Ticket;members:Member[]}){
  const [ticket,setTicket]=useState(initialTicket);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [failedAssigneeId,setFailedAssigneeId]=useState<string|null>(null);

  async function attempt(assigneeId:string){
    const previous=ticket;
    const member=members.find(x=>x.id===assigneeId)??null;
    setTicket({...ticket,assignee:member});
    setError('');
    setBusy(true);
    try{
      const updated=await assignTicket(ticket.id,assigneeId);
      setTicket(updated);
      setFailedAssigneeId(null);
    }catch(e){
      setTicket(previous);
      setError(e instanceof Error?e.message:'Assignment failed');
      setFailedAssigneeId(assigneeId);
    }finally{
      setBusy(false);
    }
  }

  function choose(assigneeId:string){
    void attempt(assigneeId);
  }

  function retry(){
    if(failedAssigneeId!==null) void attempt(failedAssigneeId);
  }

  const failedMember=failedAssigneeId?members.find(m=>m.id===failedAssigneeId)??null:null;

  return <section aria-labelledby="assignment-heading">
    <h2 id="assignment-heading">Assignment</h2>
    <p>{ticket.title}</p>
    <label htmlFor="assignee">Assigned to</label>
    <select id="assignee" value={ticket.assignee?.id??''} disabled={busy} onChange={e=>choose(e.target.value)}>
      <option value="" disabled>Unassigned</option>
      {members.map(member=><option key={member.id} value={member.id}>{member.displayName}</option>)}
    </select>
    <output aria-live="polite">{busy?'Saving…':ticket.assignee?`Assigned to ${ticket.assignee.displayName}`:'Unassigned'}</output>
    {error&&<p role="alert">{error}</p>}
    {failedAssigneeId&&<button type="button" disabled={busy} onClick={retry}>{`Retry assigning to ${failedMember?failedMember.displayName:'member'}`}</button>}
  </section>;
}
