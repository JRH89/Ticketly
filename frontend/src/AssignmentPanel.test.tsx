import '@testing-library/jest-dom/vitest'; import {render,screen,fireEvent,waitFor} from '@testing-library/react'; import {vi,it,expect} from 'vitest'; import {AssignmentPanel} from './AssignmentPanel';
const ticket={id:'t',title:'Test',status:'OPEN',organizationId:'o',assignee:null}; const members=[{id:'m',displayName:'Morgan',role:'MEMBER'}];

it('shows optimistic assignment and reconciles it',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{assignTicket:{...ticket,assignee:members[0]}}})}));
  render(<AssignmentPanel initialTicket={ticket} members={members}/>);
  expect(screen.queryByRole('button',{name:/Retry/})).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Assigned to'),{target:{value:'m'}});
  expect(screen.getByText('Saving…')).toBeInTheDocument();
  await waitFor(()=>expect(screen.getByText('Assigned to Morgan')).toBeInTheDocument());
  expect(screen.queryByRole('button',{name:/Retry/})).not.toBeInTheDocument();
});

it('reverts and announces a rejected change',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({errors:[{message:'Forbidden'}]})}));
  render(<AssignmentPanel initialTicket={ticket} members={members}/>);
  fireEvent.change(screen.getByLabelText('Assigned to'),{target:{value:'m'}});
  await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('Forbidden'));
  expect(screen.getByText('Unassigned',{selector:'output'})).toBeInTheDocument();
});

it('offers a labeled retry after failure that is disabled while pending',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({errors:[{message:'Forbidden'}]})}));
  render(<AssignmentPanel initialTicket={ticket} members={members}/>);
  fireEvent.change(screen.getByLabelText('Assigned to'),{target:{value:'m'}});
  await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('Forbidden'));
  const retryButton=screen.getByRole('button',{name:'Retry assigning to Morgan'});
  expect(retryButton).toBeEnabled();
  fireEvent.click(retryButton);
  expect(screen.getByText('Saving…')).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Retry assigning to Morgan'})).toBeDisabled();
});

it('retrying the same assignee clears the stale error and reconciles on success',async()=>{
  const fetchMock=vi.fn()
    .mockResolvedValueOnce({ok:true,json:async()=>({errors:[{message:'Forbidden'}]})})
    .mockResolvedValueOnce({ok:true,json:async()=>({data:{assignTicket:{...ticket,assignee:members[0]}}})});
  vi.stubGlobal('fetch',fetchMock);
  render(<AssignmentPanel initialTicket={ticket} members={members}/>);
  fireEvent.change(screen.getByLabelText('Assigned to'),{target:{value:'m'}});
  await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('Forbidden'));
  fireEvent.click(screen.getByRole('button',{name:'Retry assigning to Morgan'}));
  await waitFor(()=>expect(screen.getByText('Assigned to Morgan')).toBeInTheDocument());
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.queryByRole('button',{name:/Retry/})).not.toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
