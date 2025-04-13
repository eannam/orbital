import unittest
from uuid import UUID

from lib import parser


class TestParseScheduleEntries(unittest.TestCase):

    def test_basic_entry(self):
        entries = [
            {
                "entryText": [
                    "28.01.2009      Transformer Chamber (Ground   23.01.2009      EGL551039  ",
                    "tinted blue     Floor)                        99 years from              ",
                    "(part of)                                     23.1.2009",
                ]
            }
        ]
        result = parser.parse_schedule_entries(entries)

        self.assertEqual(len(result), 1)
        entry = result[0]

        self.assertTrue(UUID(entry["id"]))  # Valid UUID
        self.assertEqual(
            entry["registrationDateAndPlanReference"],
            "28.01.2009 tinted blue (part of)",
        )
        self.assertEqual(entry["description"], "Transformer Chamber (Ground Floor)")
        self.assertEqual(
            entry["leaseDateAndTerm"], "23.01.2009 99 years from 23.1.2009"
        )
        self.assertEqual(entry["lesseeTitle"], "EGL551039")
        self.assertEqual(entry["notes"], [])

    def test_entry_with_notes(self):
        entries = [
            {
                "entryText": [
                    "18.10.1988      16 Ashworth Close (Second     29.07.1988      TGL9725    ",
                    "Edged and       Floor Flat)                   125 years from             ",
                    "numbered 24                                   29.7.1988                  ",
                    "(Part of) and                                                            ",
                    "36 (Part of)                                                             ",
                    "in brown                                                                 ",
                    "NOTE 1: By a Deed dated 29 January 1996 made between (1) Orbit Housing Association (2) Nell Juliana Rosser and Patricia Ann Reed and (3) Abbey National PLC the terms of the Lease were varied.  (Copy filed under TGL9725).",
                    "NOTE 2: A Deed dated 29 January 1997 made between (1) Orbit Housing Association (2) Nell Julianna Rosser and Patricia Ann Reed and (3) Haco Limited is supplemental to the lease. It substitutes a new plan for the original lease plan. (Copy Deed filed under TGL9725)",
                ]
            }
        ]
        result = parser.parse_schedule_entries(entries)
        self.assertEqual(len(result), 1)
        entry = result[0]

        self.assertEqual(
            entry["registrationDateAndPlanReference"],
            "18.10.1988 Edged and numbered 24 (Part of) and 36 (Part of) in brown",
        )
        self.assertEqual(entry["description"], "16 Ashworth Close (Second Floor Flat)")
        self.assertEqual(
            entry["leaseDateAndTerm"],
            "29.07.1988 125 years from 29.7.1988",
        )
        self.assertEqual(entry["lesseeTitle"], "TGL9725")
        self.assertEqual(
            entry["notes"],
            [
                "NOTE 1: By a Deed dated 29 January 1996 made between (1) Orbit Housing Association (2) Nell Juliana Rosser and Patricia Ann Reed and (3) Abbey National PLC the terms of the Lease were varied.  (Copy filed under TGL9725).",
                "NOTE 2: A Deed dated 29 January 1997 made between (1) Orbit Housing Association (2) Nell Julianna Rosser and Patricia Ann Reed and (3) Haco Limited is supplemental to the lease. It substitutes a new plan for the original lease plan. (Copy Deed filed under TGL9725)",
            ],
        )

    def test_entry_with_missing_fields(self):
        entries = [
            {
                "entryText": [
                    "                Transformer Chamber (Ground   23.01.2009      EGL551039  ",
                    "                Floor)                        99 years from              ",
                    "                                              23.1.2009",
                ]
            }
        ]
        result = parser.parse_schedule_entries(entries)
        entry = result[0]

        self.assertEqual(entry["registrationDateAndPlanReference"], "")
        self.assertEqual(entry["description"], "Transformer Chamber (Ground Floor)")
        self.assertEqual(
            entry["leaseDateAndTerm"], "23.01.2009 99 years from 23.1.2009"
        )
        self.assertEqual(entry["lesseeTitle"], "EGL551039")


if __name__ == "__main__":
    unittest.main()
