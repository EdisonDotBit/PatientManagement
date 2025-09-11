using EL;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientDAL
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PatientManagement"].ConnectionString;

        public List<PatientEntity> GetPatients()
        {

            List<PatientEntity> patients = new List<PatientEntity>();


            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM PatientDetails";
                SqlCommand cmd = new SqlCommand(query, con);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();

                while (dr.Read())
                {
                    patients.Add(new PatientEntity
                    {
                        ID = (int)dr["ID"],
                        Patient = dr["Patient"].ToString(),
                        Drug = dr["Drug"].ToString(),
                        Dosage = (decimal)dr["Dosage"],
                        ModifiedDate = (DateTime)dr["ModifiedDate"]
                    });
                }
            }
            return patients;
        }

        public void CreatePatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"INSERT INTO PatientDetails (Patient, Drug, Dosage, ModifiedDate)
                                 VALUES (@Patient, @Drug, @Dosage, @ModifiedDate)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public bool IsDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                                 WHERE Patient = @Patient AND Drug = @Drug AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                con.Open();
                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }

        public void EditPatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"UPDATE PatientDetails 
                         SET Patient = @Patient, Drug = @Drug, Dosage = @Dosage, ModifiedDate = @ModifiedDate
                         WHERE ID = @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public bool IsUpdateDuplicate(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                         WHERE Patient = @Patient AND Drug = @Drug 
                         AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)
                         AND ID <> @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                con.Open();
                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }
    }
}
