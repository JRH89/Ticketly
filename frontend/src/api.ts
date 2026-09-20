export type Member={id:string;displayName:string;role:string};
export type Ticket={id:string;title:string;status:string;organizationId:string;assignee:Member|null};
export type AuditEvent={action:string;ticketId:string;actorId:string;assigneeId:string;occurredAt:string};
const endpoint=import.meta.env.VITE_GRAPHQL_URL ?? '/graphql';
async function request<T>(query:string,variables:Record<string,string>={}):Promise<T>{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','X-Actor-Id':'admin-1'},body:JSON.stringify({query,variables})});const body=await response.json();if(!response.ok||body.errors)throw new Error(body.errors?.[0]?.message??'Request failed');return body.data as T;}
/** Ticketly owns support data; delivery orchestration belongs exclusively to ForgeLoop. */
export function loadWorkspace(){return request<{tickets:Ticket[];members:Member[];audits:AuditEvent[]}>('query { tickets { id title status organizationId assignee { id displayName role } } members: organizationMembers(organizationId:"org-acme") { id displayName role } audits: auditEvents(ticketId:"ticket-142") { action ticketId actorId assigneeId occurredAt } }');}
export function assignTicket(ticketId:string,assigneeId:string){return request<{assignTicket:Ticket}>('mutation($ticketId: ID!, $assigneeId: ID!) { assignTicket(ticketId:$ticketId, assigneeId:$assigneeId) { id title status organizationId assignee { id displayName role } } }',{ticketId,assigneeId}).then(data=>data.assignTicket);}
export function createTicket(title:string){return request<{createTicket:Ticket}>('mutation($title: String!) { createTicket(title:$title) { id title status organizationId assignee { id displayName role } } }',{title}).then(data=>data.createTicket);}
