# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ticket-assignment.spec.ts >> shows evidence-backed delivery and supports ticket creation and assignment
- Location: e2e\ticket-assignment.spec.ts:2:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Ticket Assignment' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Ticket Assignment' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Ticket Assignment' })

```

```yaml
- main:
  - text: Ticketly
  - strong: Customer support workspace
  - text: Local demo · API healthy
  - paragraph: Acme Corp · Support desk
  - heading "Tickets that stay with your team." [level=1]
  - paragraph: Create tickets, assign teammates, and retain an audit trail for every assignment.
  - complementary:
    - paragraph: Tickets
    - text: New ticket
    - textbox "New ticket":
      - /placeholder: Describe the customer issue
    - button "Create"
    - button "ticket-142 Cannot export monthly report OPEN":
      - text: ticket-142 Cannot export monthly report
      - emphasis: OPEN
  - region "Assignment":
    - heading "Assignment" [level=2]
    - paragraph: Cannot export monthly report
    - text: Assigned to
    - combobox "Assigned to":
      - option "Unassigned" [disabled] [selected]
      - option "Avery Admin"
      - option "Morgan Member"
    - status: Unassigned
  - heading "Assignment audit" [level=2]
  - paragraph: No assignment events yet—make one above.
```

# Test source

```ts
  1 | import {test,expect} from '@playwright/test';
> 2 | test('shows evidence-backed delivery and supports ticket creation and assignment',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{name:'Ticket Assignment'})).toBeVisible();await expect(page.getByText('Parallel agent runs')).toBeVisible();await page.getByRole('button',{name:'Support Desk'}).click();await page.getByLabel('New ticket').fill('Example customer issue');await page.getByRole('button',{name:'Create'}).click();await expect(page.getByText('Example customer issue')).toBeVisible();await page.getByLabel('Assigned to').selectOption('member-1');await expect(page.getByText('Assigned to Morgan Member')).toBeVisible();await expect(page.getByText('Audit timeline')).toBeVisible();await page.getByRole('button',{name:'Evidence'}).click();await expect(page.getByText('Verification gates')).toBeVisible();});
    |                                                                                                                                                                                           ^ Error: expect(locator).toBeVisible() failed
  3 | 
```