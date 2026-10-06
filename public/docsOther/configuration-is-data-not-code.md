# Your Configuration Is Data, Not Code

Every project management tool evaluation reaches the same moment. Someone from
the business says "we track a field you don't have", and the vendor says one of
three things: it is on the roadmap, it will be a professional services
engagement, or you can use one of our twelve generic custom fields.

There is a fourth answer, and it is the one worth holding out for: *the field
list is a table, so add a row.*

## Every field in the system is a row you can read

The suite keeps a master field list — one row per field, over 400 of them,
covering the bars on the canvas, the extended metadata behind them, the resource
pool and the settings. Each row carries the field's label, its data type, which
picklist feeds it, which form it appears on, whether it is mandatory, how wide
its column renders, and whether it travels to OpenProject.

You read it in the app, searchable and filterable. You edit the parts that are
yours to edit. And it round-trips through your workbook, which means **your
configuration is a file you own, can diff, and can keep** — not a state trapped
inside somebody's SaaS tenancy.

## Picklists are rows too

A picklist is simply the set of rows sharing a group name. Adding a value to a
picklist is adding a row. Renaming one is editing a row. There is no code change,
no release, no ticket, and no waiting.

The same holds for which fields appear on which form, and where. Form layout is
a table. The mapping between a field and its equivalent in OpenProject is a
table. The rule the system follows is consistent enough to state in one line:
**if it is configuration, it is data, and if it is data, it lives somewhere you
can see it.**

## Why this matters more than it sounds

Three things follow from it, and they are the reasons this is worth caring about
during an evaluation rather than after one.

**Your first year is not spent waiting.** Most of what an organisation needs to
change about a PM tool, it discovers in months two through six, once real work is
in it. If those changes are code, you are in a queue. If they are rows, you make
them on a Tuesday.

**Your configuration survives the vendor.** A field list you hold as a spreadsheet
is portable in a way a vendor's internal schema is not. Combined with the option
to [own the source outright](/learn/own-the-code-buyer-guide), it means the
question "what happens if this company disappears" has a boring answer.

**Nobody has to type an integration id.** When the suite reconciles its field list
against your OpenProject instance, it reads back the identifiers your instance
actually assigned, rather than asking an administrator to transcribe them. The
mapping is data on both ends, so it can be derived instead of maintained.

## The one rule to know

Editing configuration in the app makes the browser the newest copy, immediately —
there is no save step. Your workbook is then behind.

Rather than let a stale workbook overwrite a newer browser, the product **blocks
the import** and tells you which tables are affected. Export the changed ones,
take them into the workbook, and importing is safe again.

That gate is the whole reason this model is usable rather than dangerous. A
configuration you can change in two places needs something watching which change
came last, and the product would rather stop you than lose your work.
