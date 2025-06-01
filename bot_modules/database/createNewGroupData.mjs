import supabase from "../supabase/supabase.mjs";

//create a new group record
export async function createGroupData(groupData) {
  const { data, error } = await supabase.from("groups").insert(groupData);

  if (error) throw error;

  return data;
}

export async function createAdminData(adminData) {
  const { data, error } = await supabase.from("admins").insert(adminData);

  if (error) throw error;

  return data;
}
