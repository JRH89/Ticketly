import '@testing-library/jest-dom/vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import {vi,it,expect,beforeEach} from 'vitest';
import {TicketComposer} from './TicketComposer';
import * as api from './api';

// Mock the API module so these are focused component tests that never touch
// the network; the createTicket implementation is controlled per-test below.
vi.mock('./api', () => ({
  createTicket: vi.fn(),
}));

const mockedCreateTicket = api.createTicket as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockedCreateTicket.mockReset();
});

it('shows the initial character count as 0 / 180', () => {
  render(<TicketComposer onCreated={() => {}} />);
  expect(screen.getByText('0 / 180')).toBeInTheDocument();
});

it('updates the character count as the title is typed', () => {
  render(<TicketComposer onCreated={() => {}} />);
  fireEvent.change(screen.getByLabelText('New ticket'), { target: { value: 'Printer jam' } });
  expect(screen.getByText('11 / 180')).toBeInTheDocument();
  expect(screen.queryByText('0 / 180')).not.toBeInTheDocument();
});

it('resets the title and count to 0 / 180 after a successful submission', async () => {
  const ticket = { id: 't1', title: 'Printer jam', status: 'OPEN', organizationId: 'o', assignee: null };
  mockedCreateTicket.mockResolvedValue(ticket);
  const onCreated = vi.fn();
  render(<TicketComposer onCreated={onCreated} />);

  fireEvent.change(screen.getByLabelText('New ticket'), { target: { value: 'Printer jam' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create' }));

  await waitFor(() => expect(onCreated).toHaveBeenCalledWith(ticket));
  expect(screen.getByLabelText('New ticket')).toHaveValue('');
  expect(screen.getByText('0 / 180')).toBeInTheDocument();
});

it('keeps the entered title and its matching count visible after a failed submission', async () => {
  mockedCreateTicket.mockRejectedValue(new Error('Unable to create ticket'));
  render(<TicketComposer onCreated={() => {}} />);

  fireEvent.change(screen.getByLabelText('New ticket'), { target: { value: 'Printer jam' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create' }));

  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Unable to create ticket'));
  expect(screen.getByLabelText('New ticket')).toHaveValue('Printer jam');
  expect(screen.getByText('11 / 180')).toBeInTheDocument();
});
