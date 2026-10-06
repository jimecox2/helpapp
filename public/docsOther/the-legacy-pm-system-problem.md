# Your Project System Cannot Keep Up With the Organisation

The suite was bought a decade ago. It still runs, and people still use it, but
nobody would choose it again.

Pages take seconds to load. Building a view means a consultant. The field your
finance team has been asking for since the last reorganisation is still not
there, because adding it is a change request, and change requests go into a
vendor queue behind everybody else's. Upgrading is not an upgrade — it is a
project, with a budget, a test cycle and a go-live weekend.

Meanwhile the organisation it was configured for no longer exists. The
departments have been renamed twice, the approval stages have changed, and half
the picklist values are historical artefacts nobody can delete.

## The real cost is not the licence

Per-seat renewal is the number that gets scrutinised, and it is not the expensive
part. The expensive part is everything the system stops you doing:

- **Changes wait.** A new field, a renamed stage, a different form layout —
  each one is a ticket, a quote, or a release window. So teams stop asking, and
  start keeping the real data in spreadsheets beside the system.
- **The shadow spreadsheets become the truth.** Once they exist, the official
  system is a reporting obligation rather than a working tool, and the data in it
  degrades because nobody is relying on it.
- **Reporting needs a specialist.** The information exists; getting it out
  requires someone who knows the query layer, which means answers arrive days
  after the question.
- **You cannot leave.** Ten years of configuration lives inside the vendor's
  schema, in a shape only their product understands. The migration cost is the
  lock-in.

None of this is a failure of the people running it. It is what happens when the
rate at which an organisation changes exceeds the rate at which its systems can
be changed.

## What a project information system should do instead

Three properties, and they are the ones worth testing for in any replacement.

**Configuration has to be data.** Every field in the Timebars suite is a row you
can read and edit — its label, type, picklist, which form it sits on. Over 400
ship configured. Adding a picklist value is a new row, not a support ticket, and
the whole field list
[round-trips through a spreadsheet](/learn/configuration-is-data-not-code) you
own, diff and keep. When the organisation reorganises again, you change rows on a
Tuesday afternoon.

**It has to be fast, because slow tools do not get used.** The planning
application [runs in the browser](/learn/your-plan-lives-in-your-browser) with no
server in the data path. Dragging a bar recalculates and redraws immediately.
Reports run locally. There is nothing to wait for, and nothing to be down.

**It has to meet the spreadsheets where they already are.** Rather than fighting
the shadow workbooks, the suite treats the workbook as the bulk-editing surface
and the configuration store. The data people were keeping beside the old system
becomes the data driving the new one.

## And then there is the option nobody else offers

You can buy the source code.

Not a perpetual licence — the complete codebase, across six repositories, which
you build and run yourself. Hand it to your own developers, point them at modern
AI coding tools, and reshape the product around how your organisation actually
works, in days rather than release cycles.

That changes the question at the heart of this page. "What happens when the
vendor's roadmap and our needs diverge" stops being a risk you carry for a decade
and becomes something you simply fix yourself.

It also removes the exit problem. A system whose configuration is a spreadsheet
you hold, whose data lives in your browser and your own backups, and whose source
you can compile, has no migration cliff at the end of it.

Three ways to acquire it — subscribe to the hosted service, run the versioned
containers on your own infrastructure, or own the source outright — and the
[buyer's guide](/learn/own-the-code-buyer-guide) sizes each one honestly, in
hardware, skills and effort, so you can judge the commitment before making it.

## A fair caveat

Replacing an established system is never free, and anyone telling you otherwise
is selling. You will still have to migrate data, agree new picklists, and retrain
people.

The difference is what you are left holding afterwards: a system that changes
when you change, rather than one you have to argue with.
