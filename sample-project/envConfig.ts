
export interface EnvironmentConfig {
	[key: string]: {
		env: string;
	};
}
// 各環境用の定義読み込み
import { Config } from './environments/sample';

export const envConfig: EnvironmentConfig = {
	sample: Config,
	// 他の環境の設定もここに追加できます。

}
