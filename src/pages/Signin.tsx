import { Link } from 'react-router-dom';
// import { authRepository } from '@/modules/auth/auth.repository';
import { authRepository } from '@/modules/auth/auth.mysql.repository';
import { useCurrentUserStore } from '@/modules/auth/current-user.state';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zodスキーマの定義
const signInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "メールアドレスは必須です" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      "パスワードは大文字、小文字、数字を含む必要があります"
    ),
});

// z.inferで自動で型を
type SignInFormData = z.infer<typeof signInSchema>;

function Signin() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema), // React hook formとZodを連携
    mode: "onBlur", // フォーカスが外れた時にバリデーションを行う
  });

  const currentUserStore = useCurrentUserStore();

  const signin = async (data: SignInFormData) => {
    const user = await authRepository.signin(data.email, data.password);
    currentUserStore.set(user);
  };

  if (currentUserStore.currentUser != null) return <Navigate replace to="/" />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-extrabold text-gray-900">
          Notion Clone
        </p>
        <ul className="text-sm text-gray-500">
          <li>jwtトークンでセッション管理</li>
          <li>prismaを使用したデータベース操作</li>
          <li>カテゴリ、タグ機能</li>
          <li>検索</li>
          <li>Amazon Lightsailにデプロイ</li>
          <li>Stripe決済完了ユーザーに限定して閲覧可能なページを実装</li>
          <li>Vitestを用いてコンポーネントテストを軽く実施</li>
        </ul>
        <div className="mt-8 w-full max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(signin)}>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  メールアドレス
                </label>
                <div className="mt-1">
                  <input
                    {...register("email")}
                    id="email"
                    // name="email" nameはreact-hook-formで自動的に追加される
                    placeholder="1024@example.com"
                    // required requiredはreact-hook-formで自動的に追加される
                    type="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring--500 focus:border--500 sm:text-sm"
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
                    {...register("password")}
                    id="password"
                    // name="password" nameはreact-hook-formで自動的に追加される
                    placeholder="Pass1024"
                    // required requiredはreact-hook-formで自動的に追加される
                    type="password"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring--500 focus:border--500 sm:text-sm"
                  />
                  {errors.password && <p className="text-red-500 text-sm font-medium mt-1">{errors.password.message}</p>}
                </div>
              </div>
              <div>
                <button 
                disabled={!isValid || isSubmitting}
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "処理中..." : "ログイン"}
                </button>
              </div>
              <div className="mt-4 text-center text-sm">
                登録は
                <Link className="underline" to={'/signup'}>
                  こちら
                </Link>
                から
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
