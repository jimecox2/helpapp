# How My Kanban App Keeps Your Tasks on Track

If you’ve ever wondered how a Kanban board app magically updates your task dates, hours, and progress as you drag tasks across lanes, you’re in the right place! My Kanban scheduling engine is designed to make task management smooth and intuitive. Let’s break it down into simple terms so you can see how it works behind the scenes—without all the techy jargon.

Imagine your Kanban board as a visual workspace where tasks (or "bars") move between lanes—like "To Do," "In Progress," and "Done." Before you even start dragging tasks around, you’ll set up some basics: how many hours a task will take (we call this "sizing"), when you expect it to start and finish, and how long it’ll take overall (the duration). Once that’s in place, the app takes over to keep everything up to date as you move things along.

## The system calculates progress based on a task's position in different lanes:
Lane 1 (backlog): resets progress to 0%
Lane 2 (will do): preserves existing progress values
Lane 3 (doing): sets progress to 25% or 75% (if in "finalizing" sub-lane)
Lane 4 (done): sets progress to 100%

## Your Options, Your Rules
You’re in control of how flexible the app is. There’s a setting (don’t worry about its fancy name—it’s just a toggle!) that decides whether the hours you set for a task stay locked or adjust as you tweak the timeline. By default, the hours stay fixed, meaning they won’t change even if the task takes longer or shorter than planned. But if you flip that setting, the app will tweak the hours based on the new duration you give it. It’s like telling the app, “Hey, adapt to my new plan!”

The app also needs a reference point to figure out dates and progress. You can choose whether it uses today’s date or a specific "status date" you provide (like a project milestone). This little choice keeps things flexible for how you like to track time.

##  Three Ways Tasks Move Through Time
As you drag tasks across your board, the app figures out where they stand based on that reference date (today or your status date). Here’s how it handles three common situations:

1. **Task in Progress**  
   Picture a task that’s already started but isn’t done yet—it’s halfway across your board, overlapping the reference date. The app knows it’s "in progress." It locks in the start date as something in the past (since you’ve begun!), calculates how many hours you’ve already worked, and figures out what’s left based on the time remaining. It even gives you a percentage of how complete it is, based on those hours. If you’ve set the hours to stay fixed, they won’t budge—but the remaining time and actual hours update as you go. If they’re adjustable, the app might tweak the total hours to match any new timeline you set.

2. **Task Finished**  
   If a task is fully behind the reference date, it’s done—100% complete! The app marks the start and finish dates as "actual" (no more guessing—they happened!), sets the actual hours to match what you originally planned, and drops the remaining hours to zero. The finish date you see is the real deal. Whether your hours were fixed or flexible, the app respects that choice and wraps things up neatly.

3. **Task Not Started Yet**  
   What if a task is still ahead of the reference date? It’s in the future, so there’s no progress yet—zero hours worked, zero percent complete. The app keeps it simple: as you move it around, it updates the start and finish dates and duration, but the hours stay untouched if you’ve locked them. If they’re flexible, it’ll stretch or shrink the hours based on how long you’ve made the task.

## Workdays, Not Weekends
Here’s a handy detail: the app thinks in *workdays*, not calendar days. If a task spans a weekend or holiday, it skips those days when calculating how long it’ll really take. So, a task that looks like it stretches over five days might only count as three workdays if a weekend sneaks in there. The app’s always recalculating this to keep your schedule realistic.

##  What Happens Behind the Curtain
Every time you move a task, the app springs into action. It crunches all these numbers—start dates, finish dates, hours worked, hours left, and progress percentages—then updates everything so your board reflects the latest reality. It’s like having a super-smart assistant who instantly reworks your plan as you go, without you lifting a finger.

So, whether you’re juggling a busy project or just keeping your to-do list in check, my Kanban app is built to adapt to your style, keep your dates on point, and show you exactly where you stand—all with a simple drag and drop. Pretty cool, right?