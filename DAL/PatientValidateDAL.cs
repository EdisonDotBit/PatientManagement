using EL;
using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientValidateDAL : PatientContextDAL
    {
        public PatientEntity GetPatientByID(int ID)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand("spGetPatientByID", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ID", ID);
                con.Open();
                using (var dr = cmd.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        return new PatientEntity
                        {
                            ID = (int)dr["ID"],
                            Patient = dr["Patient"].ToString(),
                            Drug = dr["Drug"].ToString(),
                            Dosage = (decimal)dr["Dosage"],
                            ModifiedDate = (DateTime)dr["ModifiedDate"]
                        };
                    }
                }
            }
            return null;
        }
        public bool IsAddDrugDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
               using (SqlCommand cmd = new SqlCommand("spCheckAddDrugDuplicate", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                    cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                    cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                    con.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }

        public bool IsAddExactDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("spCheckAddExactDuplicate", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                    cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                    cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                    cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                    con.Open();
                    return (int)cmd.ExecuteScalar() > 0;
                }
            }
        }
        public bool IsUpdateDrugDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand("spCheckUpdateDrugDuplicate", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                con.Open();
                return (int)cmd.ExecuteScalar() > 0;
            }
        }
        public bool IsUpdateExactDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            using (SqlCommand cmd = new SqlCommand("spCheckUpdateExactDuplicate", con))
            {
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                con.Open();
                return (int)cmd.ExecuteScalar() > 0;
            }
        }
    }
}
