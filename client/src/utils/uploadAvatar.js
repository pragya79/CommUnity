
export const uploadAvatarToServer = async (formData) => {
    try {
      const response = await fetch("http://localhost:5000/upload-avatar", {
        method: "POST",
        body: formData,
      });
      console.log("Avatar upload response:", response);

      const data = await response.json();
      if (response.ok) {
        return { avatarPath: data.avatarPath }; 
      } else {
        throw new Error(data.message || "Failed to upload avatar");
      }
      
    } catch (error) {
      throw new Error("Error uploading avatar: " + error.message);
    }
  };
  