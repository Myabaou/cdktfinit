# CDK for Terraform

AWS、Terraform、infracostを使用してインフラストラクチャのコストを管理および監視するためのMakefileコマンドのセット

## 前提条件

Makefileコマンドを使用する前に、次の前提条件を満たしていることを確認してください。

- [AWS CLI](https://aws.amazon.com/cli/)がインストールされていること
- [AWS SSO](https://aws.amazon.com/single-sign-on/)が設定されていること
- [aws-vault](https://github.com/99designs/aws-vault)がインストールされていること
- [Terraform](https://www.terraform.io/)がインストールされていること
- [infracost](https://www.infracost.io/)がインストールされていること
- [CDKTF](https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install)がインストールされていること

macOSユーザーの場合、Homebrewを使用して`infracost`をインストールできます。

```
brew install infracost
```

### stateファイルの管理
stateファイルの管理はS3バケットを利用している前提になるので
予めS3バケットを作成しておく必要があります。

作成後　`cdktf.json`の terraformBackend bucketの値を
作成したバケットに変更してください。

## 設定

1. `aws-sample`プロファイルを設定してAWS SSOプロファイルをセットアップします。
2. Makefile内の`ENV`変数をカスタマイズして利用可能な環境を設定します。

## 使用方法

```sh
mkdir sample-project
cd sample-project
cdktf init --template="typescript" --providers="aws@~>5.0"
```

### AWS認証の確認

AWS認証を確認するには、次のコマンドを実行します。

```
make ensure-aws-auth
```

このコマンドは、指定したプロファイル（`aws-sample`）に関連するAWS SSOセッションが期限切れまたは無効かどうかを確認します。必要に応じて、再ログインを求めます。

### コストの表示

特定の環境のインフラストラクチャのコスト見積もりを表示するには、次のコマンドを実行します。

```
make _ENV={環境名} costview
```

このコマンドは、`cdktf`を使用してTerraformの設定を生成し、`infracost`を使用して見積もりのコストの詳細を提供します。

### コストの差分比較

現在のインフラストラクチャとベース構成とのコストの差分を比較するには、次のコマンドを使用します。

```
make _ENV={環境名} costdiff
```

このコマンドは、`cdktf`を使用してTerraformの設定を生成し、それをベース構成と比較してコストを比較します。
ベース構成ファイルは`cost/infracost-{環境}-base.json`に保存されている必要があります。

### コストの修正と更新

指定した環境のインフラストラクチャのコストを修正および更新するには、次のコマンドを実行します。

```
make _ENV={環境名} costfix
```

このコマンドは、`infracost`を使用してコストの詳細を生成し、
それをベース構成ファイル（`cost/infracost-{環境}-base.json`）として保存します。

### Terraformおよびcdktfコマンド

Terraformおよびcdktfのコマンドを直接実行するには、必要なコマンドを指定します。例：

- DryRun(どちらでも同じ挙動)
```sh
make _ENV={環境名} plan
```

```sh
make _ENV={環境名} diff
```


- Apply/Deploy (どちらでも同じ挙動)
```sh
make _ENV={環境名} deploy
```

```sh
make _ENV={環境名} apply
```

### Terraformでの実行

```sh
make _ENV={環境名} _TF=true {サブコマンド}
```

- staging環境でterraform でDryRunしたい場合
```sh
make _ENV=stg _TF=true plan
```

#### 複数サブコマンド指定する場合はダブルクォートで囲む
- (例)作成済みのリソース一覧確認
```sh
make _ENV=stg _TF=true "state list"
```


- import(staging/Cloudfront)
```sh
make _ENV=stg _TF=true "import aws_cloudfront_distribution.Cloudfront EXXXXX"
```


**注意:** `deploy`、`apply`、`diff`、または`plan`コマンドの実行中には、`infracost`コマンドも自動的に呼び出されます。

---
