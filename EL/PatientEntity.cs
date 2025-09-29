using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace EL
{
    public class PatientEntity
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "Patient name is required.")]
        [StringLength(50, ErrorMessage = "Patient name cannot exceed 50 characters.")]
        [RegularExpression(@"^(?!\s*$)[a-zA-Z\s'-]+$", ErrorMessage = "Patient name cannot be blank and can only contain letters, spaces, hyphen, and apostrophe.")]

        public string Patient { get; set; }

        [Required(ErrorMessage = "Drug name is required.")]
        [StringLength(50, ErrorMessage = "Drug name cannot exceed 50 characters.")]
        [RegularExpression(@"^(?=.*[A-Za-z])[A-Za-z0-9\s]+$", ErrorMessage = "Drug name must contain letters and may include numbers and spaces only.")]

        public string Drug { get; set; }

        [Required(ErrorMessage = "Dosage is required.")]
        [Range(0.0001, 999.9999, ErrorMessage = "Dosage must be between 0.0001 and 999.9999.")]
        [RegularExpression(@"^\d+(\.\d{1,4})?$", ErrorMessage = "Dosage can have up to 4 decimal places only.")]
        public decimal Dosage { get; set; }

        public DateTime ModifiedDate { get; set; }
    }
}
