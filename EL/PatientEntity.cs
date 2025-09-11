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
        public string Patient { get; set; }

        [Required(ErrorMessage = "Drug name is required.")]
        [StringLength(50, ErrorMessage = "Drug name cannot exceed 50 characters.")]
        public string Drug { get; set; }

        [Required(ErrorMessage = "Dosage is required.")]
        [Range(0.01, 9999.99, ErrorMessage = "Dosage must be greater than 0.")]
        public decimal Dosage { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
