'use client';

// Info icon next to the Manage Pubsets title. Opens a dialog with the what and why of pubsets,
// dashboard sources and access control, so the page itself only carries the how-to steps.

import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function PubsetsInfo() {
  return (
    <Dialog>
      <DialogTrigger
        title="What are pubsets and dashboard sources?"
        aria-label="What are pubsets and dashboard sources?"
        className="text-blue-600 hover:text-blue-800"
      >
        <Info className="w-6 h-6" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Pubsets and dashboard sources</DialogTitle>
          <DialogDescription>What they are, why you make them, and who can see them.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What is a pubset?</h3>
            <p>
              A pubset (published dataset) is a snapshot of a project schedule that a Project Manager publishes
              from Agilebars, Timebars or Costbars.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What is a dashboard source?</h3>
            <p>
              A dashboard source combines several pubsets into one consolidated set of data. The Enterprise
              Dashboard reports and charts read from a source, not from single pubsets.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Why make one?</h3>
            <p>
              A source gives you one view across many projects, for example all projects in a division, all
              active projects, or one portfolio. You can make as many sources as you need, one per purpose,
              and open any of them from the Enterprise Dashboard.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Which pubsets can I see?</h3>
            <p className="mb-2">Access is role based (RBAC), from your role, customer ID and the grants on each pubset:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Owner:</strong> always sees the pubsets they published.</li>
              <li><strong>Administrator:</strong> sees every pubset in their customer organization.</li>
              <li><strong>Project Manager:</strong> sees pubsets whose PM grant list holds their email.</li>
              <li><strong>Team Member:</strong> sees pubsets whose Team Member grant list holds their email.</li>
              <li><strong>No role or grants:</strong> sees only their own pubsets.</li>
            </ul>
            <p className="mt-2">
              Missing a pubset? The <strong>Manage Access</strong> page (Pubsets menu) shows why,
              then ask the pubset&apos;s Project Manager or your Administrator for access.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
