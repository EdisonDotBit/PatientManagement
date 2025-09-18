using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EL
{
    public class ResultEntity
    {
        public bool Success { get; set; } // true if operation ran without errors
        public bool IsValid { get; set; } // true if validation passed (no duplicate)
        public string Message { get; set; }
        
    }
}
