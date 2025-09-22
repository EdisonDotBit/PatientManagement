using EL;
using System;
using System.Collections.Generic;
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
                using(SqlCommand cmd = new SqlCommand("spGetPatients", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    con.Open();
               
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
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
                }
            }
            return patients;
        }
        public List<PatientEntity> SearchPatients(string date, string dosage, string drug, string patient)
        {
            List<PatientEntity> patients = new List<PatientEntity>();
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("spSearchPatients", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Date", string.IsNullOrWhiteSpace(date) ? (object)DBNull.Value : DateTime.Parse(date));
                    cmd.Parameters.AddWithValue("@Dosage", string.IsNullOrWhiteSpace(dosage) ? (object)DBNull.Value : decimal.Parse(dosage));
                    cmd.Parameters.AddWithValue("@Drug", string.IsNullOrWhiteSpace(drug) ? (object)DBNull.Value : drug);
                    cmd.Parameters.AddWithValue("@Patient", string.IsNullOrWhiteSpace(patient) ? (object)DBNull.Value : patient);

                    con.Open();
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
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
                }
            }
            return patients;
        }
        public bool CreatePatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("spCreatePatient", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                    cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                    cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                    cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public bool EditPatient(PatientEntity patientEntity)
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
               using (SqlCommand cmd = new SqlCommand("spEditPatient", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Patient", patientEntity.Patient);
                    cmd.Parameters.AddWithValue("@Drug", patientEntity.Drug);
                    cmd.Parameters.AddWithValue("@Dosage", patientEntity.Dosage);
                    cmd.Parameters.AddWithValue("@ModifiedDate", patientEntity.ModifiedDate);
                    cmd.Parameters.AddWithValue("@ID", patientEntity.ID);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public bool DeletePatient(int ID)
        {
            using (SqlConnection con = new SqlConnection(connectionString)) 
            {
               using (SqlCommand cmd = new SqlCommand("spDeletePatient", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@ID", ID);

                    con.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
    }
}