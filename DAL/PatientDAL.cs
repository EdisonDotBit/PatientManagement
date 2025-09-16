using EL;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace DAL
{
    public class PatientDAL : PatientContextDAL
    {
        public List<PatientEntity> GetPatients()
        {
            List<PatientEntity> patients = new List<PatientEntity>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = "SELECT * FROM PatientDetails";
                SqlCommand cmd = new SqlCommand(query, con);

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

        public bool CreatePatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"INSERT INTO PatientDetails (Patient, Drug, Dosage, ModifiedDate)
                                 VALUES (@Patient, @Drug, @Dosage, @ModifiedDate)";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }

        public bool EditPatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                string query = @"UPDATE PatientDetails 
                         SET Patient = @Patient, Drug = @Drug, Dosage = @Dosage, ModifiedDate = @ModifiedDate
                         WHERE ID = @ID";

                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                cmd.Parameters.AddWithValue("@ID", patientEntity.ID);
                
                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }

        public bool DeletePatient(int ID)
        {
            using (SqlConnection con = new SqlConnection(connectionString)) 
            {
                con.Open();
                string query = "DELETE FROM PatientDetails WHERE ID = @ID";
                SqlCommand cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@ID", ID);

                int rowsAffected = cmd.ExecuteNonQuery();
                return rowsAffected > 0;
            }
        }
    }
}
