using EL;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientValidateDAL : PatientContextDAL
    {
        public bool IsDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                                 WHERE Patient = @Patient AND Drug = @Drug AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }

        public bool IsUpdateDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient AND Drug = @Drug 
                         AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)
                         AND ID <> @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }
    }
}
