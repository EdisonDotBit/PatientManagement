using EL;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientValidateDAL : PatientContextDAL
    {
        public bool IsAddDrugDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient 
                           AND Drug = @Drug 
                           AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        public bool IsAddExactDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient 
                           AND Drug = @Drug 
                           AND Dosage = @Dosage
                           AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        public bool IsUpdateDrugDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient 
                           AND Drug = @Drug 
                           AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)
                           AND ID <> @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                return (int)cmd.ExecuteScalar() > 0;
            }
        }

        public bool IsUpdateExactDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient 
                           AND Drug = @Drug 
                           AND Dosage = @Dosage
                           AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)
                           AND ID <> @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                return (int)cmd.ExecuteScalar() > 0;
            }
        }
    }
}
