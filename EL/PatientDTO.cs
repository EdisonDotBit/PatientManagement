using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL
{
    public class PatientDTO
    {
        public int ID { get; set; }
        public decimal Dosage { get; set; }
        public string Drug { get; set; }
        public string Patient { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
