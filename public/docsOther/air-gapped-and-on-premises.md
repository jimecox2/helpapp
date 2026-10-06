# Air-Gapped and On-Premises Deployment

Some organisations cannot put their project portfolio in somebody else's cloud.
Defence programmes, critical national infrastructure, parts of health and
finance, and any programme whose schedule is itself sensitive. For them the
question is not which features a PM tool has. It is whether it can run inside the
boundary at all.

This one can, and the reason is architectural rather than a special edition.

## Why it deploys where other tools cannot

The planning application is [browser-local](/learn/your-plan-lives-in-your-browser).
There is no application server in the data path for day-to-day work, and the
optional services — publishing, dashboards, notifications — are containers you
choose to run or not to run.

That produces an unusually small thing to deploy and approve. There is no vendor
telemetry to negotiate, no phone-home to whitelist, and no dependency on a
control plane you do not operate.

## Three ways to acquire it, two places to run it

Keep the two questions separate and the choice becomes straightforward.

**What do you acquire?**

| | You acquire | You are responsible for |
|---|---|---|
| **Subscribe** | a subscription to the hosted service | nothing operational |
| **Containers** | pre-built, versioned Docker images | infrastructure and operations |
| **Source** | the complete source across six repositories | development, build pipeline, infrastructure and operations |

**Where does it run?** The container and source options both run wherever you
choose: your public cloud tenancy, your own data centre, or a network with no
route out at all.

## What an air-gapped installation looks like

The whole solution is containerised. An air-gapped installation is therefore the
ordinary installation with the images carried in rather than pulled:

1. Pull the versioned images in a connected environment and export them.
2. Carry them across your boundary by whatever process you already use.
3. Load and run them inside. There is no activation call-out and no licence
   server to reach.
4. Users open the application in a browser on the internal network. Planning data
   stays on their machines; anything shared goes to your internal instance of the
   optional services.

Updates follow the same path. You control when they happen, which for a regulated
programme is usually the point.

## Ownership, for the paranoid and the prudent

If the concern is not this year's deployment but the next decade's, the source
option answers it directly. You acquire the complete codebase, build it yourself,
and run it on infrastructure you control. There is no vendor to outlive, no
forced upgrade, and no renewal conversation that can hold your portfolio hostage.

Because [configuration is data](/learn/configuration-is-data-not-code) rather
than code, your field definitions, picklists and form layouts come with you as
ordinary spreadsheet content — which means even the customisation you have built
up is portable.

The [buyer's guide](/learn/own-the-code-buyer-guide) sizes all three options
honestly: hardware, skills and effort, so you can judge the commitment before
making it rather than after.
