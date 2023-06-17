# (ex)
# cdktfの場合: make _ENV=stg diff
# terraformの場合: make _ENV=stg _TF=true "state list"
# infracostをインストール済みじゃないと正常に稼働しない
# Macの場合 brew install infracost

_AWSPROFILE=aws-sample
_ENV ?= dev
_TF ?= false


ifeq ($(_ENV),prd)
_environment=production
else ifeq ($(_ENV),stg)
_environment=staging
else
_environment=$(_ENV)
endif


.PHONY: ensure-aws-auth costview install
install:
	npm install @cdktf/provider-aws
	npm install --save-dev @types/node

# AWS SSO 認証していない場合再認証
ensure-aws-auth:
	@{ \
	set +e ;\
	IDENTITY=$$(aws sts get-caller-identity --profile $(_AWSPROFILE) 2>&1) ;\
	if echo $$IDENTITY | grep -q 'The SSO session associated with this profile has expired or is otherwise invalid' ; then \
		aws sso login --profile $(_AWSPROFILE) ;\
	else \
		echo "[INFO]: AWS SSO $(_AWSPROFILE) Authentication successful!" ;\
	fi \
	}

costview:
	export ENV_ID=$(_environment) && aws-vault exec $(_AWSPROFILE) -- cdktf synth ${_environment}
	infracost breakdown --path cdktf.out/stacks/${_environment}

costdiff:
	export ENV_ID=$(_environment) && aws-vault exec $(_AWSPROFILE) -- cdktf synth ${_environment}
	infracost diff --path cdktf.out/stacks/${_environment} --compare-to cost/infracost-${_environment}-base.json

costfix:
	infracost breakdown --path cdktf.out/stacks/${_environment} --format json --out-file cost/infracost-${_environment}-base.json

define TERRAFORM_CMD
	aws-vault exec $(_AWSPROFILE) -- terraform -chdir="cdktf.out/stacks/${_environment}" $@
endef

define CDKTF_CMD
	export ENV_ID=$(_environment) && aws-vault exec $(_AWSPROFILE) -- cdktf $@ ${_environment}
endef

%:
	@make ensure-aws-auth 
	@if [ "$(_TF)" = "true" ]; then \
		echo "[CMD]: $(TERRAFORM_CMD)"; \
		$(TERRAFORM_CMD); \
	else \
		echo "[CMD]: $(CDKTF_CMD)"; \
		$(CDKTF_CMD); \
	fi;

# infracostがインストールされていない場合は途中終了
	@if ! command -v infracost > /dev/null; then \
		echo "[INFO]infracost is not installed. Aborting."; \
		exit 1; \
	fi; \
	\

	@if [ "$@" = "deploy" -o "$@" = "apply" ]; then \
		echo "[INFO]: ${_environment} Cost is Fixed. "; \
		make _ENV=${_ENV} costfix; \
	elif [ "$@" = "diff" -o "$@" = "plan" ]; then \
		echo "[INFO]: ${_environment} Cost Checkd. "; \
		make _ENV=${_ENV} costdiff; \
    else \
		echo "[INFO]: ${_environment} infracost no operation. "; \
	fi;