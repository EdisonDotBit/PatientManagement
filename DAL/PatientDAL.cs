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

        public void CreatePatient(PatientEntity patient)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"INSERT INTO PatientDetails (Patient, Drug, Dosage, ModifiedDate)
                                 VALUES (@Patient, @Drug, @Dosage, @ModifiedDate)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patient.Patient);
                cmd.Parameters.AddWithValue("@Drug", patient.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patient.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patient.ModifiedDate);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public bool IsDuplicate(PatientEntity patient)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                string query = @"SELECT COUNT(*) FROM PatientDetails 
                                 WHERE Patient = @Patient AND Drug = @Drug AND CAST(ModifiedDate AS DATE) = CAST(@ModifiedDate AS DATE)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patient.Patient);
                cmd.Parameters.AddWithValue("@Drug", patient.Drug);
                cmd.Parameters.AddWithValue("@ModifiedDate", patient.ModifiedDate);

                con.Open();
                int count = (int)cmd.ExecuteScalar();
                return count > 0;
            }
        }
    }
}
