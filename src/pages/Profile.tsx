import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { profileRepository } from "@/modules/profile/profile.repository";
import { useState, useEffect } from "react";
import { Profile as ProfileType } from "@/modules/profile/profile.entity";
import { Camera } from "lucide-react";

function Profile() {
  const { currentUser } = useCurrentUserStore();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    const data = await profileRepository.getProfile(currentUser.id);
    setProfile(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !currentUser) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const publicUrl = await profileRepository.uploadAvatar(currentUser.id, file);
      const updatedProfile = await profileRepository.updateProfile(currentUser.id, publicUrl);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
      <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-400">
                  {currentUser?.user_metadata?.name?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer hover:bg-slate-700">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentUser?.user_metadata?.name}</h2>
            <p className="text-gray-600">{currentUser?.email}</p>
            {uploading && <p className="text-sm text-gray-500 mt-2">アップロード中...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;