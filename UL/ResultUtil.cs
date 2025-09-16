using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UL
{
    public class ResultUtil
    {
        // Successful messages
        public static string Saved => "Record successfully saved.";
        public static string Updated => "Record successfully updated.";
        public static string Deleted => "Record successfully deleted.";
        public static string HasChanges = "Changes detected. Ready to update.";

        // Error messages
        public static string NotFound => "Record not found.";
        public static string NoChanges => "No changes detected.";
        public static string Duplicate => "Cannot add same drug to a patient on the same day.";
        public static string NoDuplicateFound => "No duplicate found.";
        public static string UpdateDuplicate => "Cannot update to a duplicate drug for this patient on the same day.";

        // Exception messages
        public static string DeleteError(string ex) => $"Error deleting record: {ex}";
        public static string DuplicateError(string ex) => $"Error checking duplicate: {ex}";
        public static string CreateError(string ex) => $"Error creating record: {ex}";
        public static string UpdateError(string ex) => $"Error updating record: {ex}";
        public static string GetError(string ex) => $"Error retrieving record: {ex}";

        // More generic messages
        public static string UnexpectedError => "An unexpected error occurred.";
    }
}
