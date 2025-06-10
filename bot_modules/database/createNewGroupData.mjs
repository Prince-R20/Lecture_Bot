import supabase from "../client/supabase.mjs";

//create a new group record
export async function createGroupData(groupData) {
  try {
    const { data, error } = await supabase.from("groups").insert(groupData);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating new group data:", error);
    throw error;
  }
}

export async function createAdminData(adminData) {
  try {
    const { data, error } = await supabase.from("admins").insert(adminData);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating new admin data:", error);
    throw error;
  }
}
