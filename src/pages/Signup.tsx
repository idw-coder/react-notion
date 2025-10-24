import { authRepository } from "@/modules/auth/auth.repository";
import { useCurrentUserStore } from "@/modules/auth/current-user.state";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";

// フォーム型の定義
type SignUpFormData = {
  name: string;
  email: string;
  password: string;
}

function Signup() {
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors }
  } = useForm<SignUpFormData>({
    mode: "onBlur", // フォーカスが外れた時にバリデーションを行う
  });

  const currentUserStore = useCurrentUserStore();

  const signup = async (data: SignUpFormData) => {
    const user = await authRepository.signup(data.name, data.email, data.password);
    currentUserStore.set(user);
  };

  if (currentUserStore.currentUser != null) return <Navigate replace to="/" />;


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Notionクローン
        </h2>
        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(signup)}>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  ユーザー名
                </label>
                <div className="mt-1">
                  <input
                    {...register("name", {
                      required: "ユーザー名は必須です",
                    })}
                    id="username"
                    // name="username" nameはreact-hook-formで自動的に追加される
                    placeholder="ユーザー名"
                    // required requiredはreact-hook-formで自動的に追加される
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm font-medium mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    {...register("email", {
                      required: "メールアドレスは必須です",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "有効なメールアドレスを入力してください"
                      },
                    })}
                    id="email"
                    // name="email" nameはreact-hook-formで自動的に追加される
                    placeholder="メールアドレス"
                    // required requiredはreact-hook-formで自動的に追加される
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                  {errors.email && <p className="text-red-500 text-sm font-medium mt-1">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  パスワード
                </label>
                <div className="mt-1">
                  <input
                    {...register("password", {
                      required: "パスワードは必須です",
                      minLength: {
                        value: 8,
                        message: "パスワードは8文字以上で入力してください"
                      },
                    })}
                    id="password"
                    // name="password" nameはreact-hook-formで自動的に追加される
                    placeholder="パスワード"
                    // required requiredはreact-hook-formで自動的に追加される
                    type="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                  />
                  {errors.password && <p className="text-red-500 text-sm font-medium mt-1">{errors.password.message}</p>}
                </div>
              </div>
              <div>
                <button
                disabled={!isValid || isSubmitting}
                type="submit"
                onClick={handleSubmit(signup)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "処理中..." : "登録"}
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                既にアカウントをお持ちですか？
                <Link className="underline" to={'/signin'}>
                  こちら
                </Link>
                からログイン
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
