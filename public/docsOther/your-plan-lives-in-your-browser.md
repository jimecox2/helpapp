# Your Plan Lives in Your Browser

Most project tools put a server between a planner and their plan. Drag a bar,
wait for a round trip. Open a report, wait for a query. Lose the network, lose
the afternoon. Have an outage, and a hundred people stop working at once.

The Timebars suite is built the other way round. **Project data is held in the
browser's own database.** Plans open, bars drag and reports run with no server in
the path at all.

## What that actually means day to day

- **It works offline.** On a train, on a plane, on a client site with guest wi-fi
  that blocks everything interesting. The plan opens and the scheduling engine
  runs, because both are already on the machine.
- **It is fast in the way local software is fast.** Dragging a bar recalculates
  and redraws immediately, because there is nothing to wait for.
- **A backend outage stops nobody planning.** Publishing might be unavailable;
  planning is not. The blast radius of a server problem is small and, crucially,
  it is not the work itself.

## Everything else is optional

Cloud publishing, the dashboards, the text notifications and the OpenProject sync
are separate services you switch on if you want them. A planner running only the
client application has a complete, working product — they simply do not have team
sharing or cloud dashboards.

This is unusual enough to be worth saying plainly to whoever reviews your
architecture: **there is no application server in the data path for day-to-day
work.** The deployment footprint is small, and the failure modes are limited.

When you do publish, you publish deliberately: a snapshot goes to the cloud, the
dashboards read it, and you can push a single configuration change into many
published datasets at once rather than republishing each by hand.

## What a security reviewer will want to know

Three questions come up every time, so here are the answers up front.

**Where does project data sit?** In the browser's local database on the user's own
machine, until that user chooses to publish. Nothing leaves by default.

**What crosses the network?** Only what you switch on — a publish you initiate, a
dashboard read, a sync run you trigger. Transmission is over HTTPS/TLS.

**What happens if we never turn the backend on at all?** You get the full planning
product, offline, with the spreadsheet as your shared source of truth. Plenty of
customers run exactly this way.

## The trade you are making

It is a real trade, and it is only fair to name it. Because the browser holds the
current copy, **the browser is the source of truth until you publish or export.**
That puts a little more responsibility on backup discipline than a
server-of-record product does, which is why the suite ships an explicit backup
and restore story rather than assuming somebody else is handling it.

In exchange you get software that is fast, that works when the network does not,
and that can be deployed [somewhere with no route to the
internet](/learn/air-gapped-and-on-premises) at all.
