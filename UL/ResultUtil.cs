using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UL
{
    public class ResultUtil
    {
        public static string Saved => "Record successfully saved.";
        public static string Updated => "Record successfully updated.";
        public static string Deleted => "Record successfully deleted.";

        // Error messages
        public static string NotFound => "Record not found.";
        public static string NoChanges => "No changes detected.";
        public static string Duplicate => "Cannot add same drug to a patient on the same day.";
        public static string UpdateDuplicate => "Cannot update to a duplicate drug for this patient on the same day.";
        public static string DeleteError(string ex) => $"Error deleting record: {ex}";

        // More generic messages
        public static string UnexpectedError => "An unexpected error occurred.";
    }
}
