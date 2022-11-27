$(function () {
    let splide = {};
    
    initVueBlocks();
    initEventsHandlers();
    initCarousel();

    function initCarousel() {
        splide = new Splide('.splide', {
            type: 'loop',
            perPage: 5,
            perMove: 1,
            gap: 25,
            pagination: false,
            width: '68%',
            // height: 96,
        });

        splide.mount();

        splide.on( 'resize', function () {
            setCorrectPages();
        } );

        function setCorrectPages(){
            const windowWidth = $(window).width();
            if (windowWidth < 768) {
                splide.options = {
                    perPage: 2,
                };
                return;
            }
            
            if(windowWidth < 1200){
                splide.options = {
                    perPage: 4,
                    width: '75%',
                };
                return;
            }

            splide.options = {
                perPage: 5,
            };
        }
    }

    function fetchCoinsData() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://api.coinlore.net/api/tickers/',
                type: 'GET'
            }).done(function (data) {
                const usedCoins = ['BTC', 'ETH', 'XRP', 'BCH', 'LTC'];
                const coinsDetails = data.data.filter(coin => usedCoins.includes(coin.symbol));
                resolve(coinsDetails);
            }).fail(function (err) {
                console.log(err);
                reject(err);
            });
        });

    }



    /**
     * Renders all repetitive blocks using vue3
     */
    function initVueBlocks() {
        initCoinsBlock();

        
        function initCoinsBlock() {
            const { createApp } = Vue

            createApp({
                data() {
                    return {
                        coinsData: [],
                    }
                },
                methods: {
                    async getCoinsData() {
                        this.coinsData = await fetchCoinsData();
                    },
                    formatPrices() {
                        this.coinsData.map(coin => {
                            coin.format_price_usd = formatter.format(coin.price_usd);
                        });
                    },
                },
                async mounted() {
                    await this.getCoinsData();
                    this.formatPrices();
                },
            }).mount('#coins');

            createApp({
                data() {
                    return {
                        whysData: [
                            {
                                title: `Superior Trade<br>Execution`,
                                desc: `99% of trades are executed in <b>less than a second</b>, with no requotes or rejections.`,
                                img: `fast-execusion-icon.png`
                            },
                            {
                                title: `Competitive<br>Pricing`,
                                desc: `We offer some of the <b>lowest spreads</b> and we don’t charge commissions.`,
                                img: `competitive-pricing-icon.png`
                            },
                            {
                                title: `Advanced<br>Technology`,
                                desc: `Trade on <b>MT4</b> or <b>MT5</b>, with expert tools, across desktop, web and mobile.`,
                                img: `tech-icon.png`
                            },
                            {
                                title: `Start with $5`,
                                desc: `Start trading your preferred instruments with as little as <b>a $5 minimum deposit.</b>`,
                                img: `dollar-icon.png`
                            },
                        ],
                    }
                }
            }).mount('#why');

            createApp({
                data() {
                    return {
                        learnsData: [
                            {
                                title: `Authorised and Regulated`,
                                desc: `At XM, we adhere to all regulatory standards and are fully authorised and regulated by FSC.`,
                                img: `icon-regulation.png`
                            },
                            {
                                title: `Committed and Fair`,
                                desc: `We operate with complete transparency and adhere to the highest professional and ethical standards.`,
                                img: `icon-fair.png`
                            },
                            {
                                title: `Multi-Award-Winning`,
                                desc: `Over the years we have received over 40 awards for the quality of our products and services.`,
                                img: `icon-award.png`
                            },
                            {
                                title: `24/7 Support`,
                                desc: `Our support agents are on hand 24/7 to answer your questions or assist you with any issues.`,
                                img: `icon-support.png`
                            },
                        ],
                    }
                }
            }).mount('#learn');
        }

        /**
     * formatter converts the number to a USD currency string and adds commas to separate thousands with dollar sign
     */
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    /**
     * Initializes all events handlers
     */
    function initEventsHandlers() {
        initFormEventsHandlers();
        initWindowResizeEventsHandlers();

        function initWindowResizeEventsHandlers() {
            $(window).resize(function () {
                
            });
        }

        /**
         * Initializes all form events handlers
         */
        function initFormEventsHandlers() {
            const isValidForm = {
                email: false,
                password: false,
            }
            const formButton = '.register__form-button';
            const successMessage = '.register__success';


            /**
             * Handles form submittion
             */
            $('#register-form').on('submit', function (e) {
                e.preventDefault();
                const emailValue = $(this).find('[name="email"]').val();
                const passwordValue = $(this).find('[name="password"]').val();
                const email = escape(emailValue);
                const password = escape(passwordValue);

                console.log('form submited', email, password);
                $(successMessage).addClass('show');
            });

            /**
             * Validates form email field
             */
            $('#register-form [name="email"]').on('keyup keydown change', function (e) {
                preventSpaceKeypress(e);
                const email = $(this).val();
                let emailRule = `.register__form-email-rule`;

                const isValid = validateEmail(email);
                if (!isValid) {
                    isValidForm.email = false;
                    $(emailRule).removeClass('valid');
                    $(emailRule).addClass('invalid');
                } else {
                    $(emailRule).addClass('valid');
                    $(emailRule).removeClass('invalid');
                    isValidForm.email = true;
                }
                
                if (email === '') {
                    $(emailRule).removeClass('invalid');
                    $(emailRule).removeClass('valid');
                }
                checkFormValidity();
                
                /**
                 * Check if email is valid
                 * @param {string} email - email to validate
                 * @returns boolean
                 */
                function validateEmail(email) {
                    const emalRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return emalRegex.test(email);
                }
            });
            /**
             * Validates form password field
             */
            $('#register-form [name="password"]').on('keyup keydown change', function (e) {
                preventSpaceKeypress(e);
                const password = $(this).val();
                let isValid = true;
                let passwordRule = `.register__form-passwords-rule`;


                const validation = validatePassword(password);

                for (const item in validation) {
                    var passwordMsg = `${passwordRule}[data-type="${validation[item].name}"]`;
                    if (validation[item].isValid === true) {
                        $(passwordMsg).addClass('valid');
                        $(passwordMsg).removeClass('invalid');
                    } else {
                        $(passwordMsg).removeClass('valid');
                        $(passwordMsg).addClass('invalid');
                        isValid = false;
                    }
                }

                if (!isValid) {
                    isValidForm.password = false;
                } else {
                    isValidForm.password = true;
                }
                
                if (password === '') {
                    $(passwordRule).removeClass('invalid');
                    $(passwordRule).removeClass('valid');
                }
                
                checkFormValidity();

                function validatePassword(password) {
                    var passwordIsvalid = {
                        lowercase: {
                            isValid: false,
                            name: 'lowercase',
                        },
                        uppercase: {
                            isValid: false,
                            name: 'uppercase',
                        },
                        number: {
                            isValid: false,
                            name: 'number',
                        },
                        length: {
                            isValid: false,
                            name: 'length',
                        },
                        specialChar: {
                            isValid: false,
                            name: 'specialChar',
                        },
                    };
                    // Validate lowercase letters
                    var lowerCaseLetters = /[a-z]/g;
                    if (password.match(lowerCaseLetters)) {
                        passwordIsvalid.lowercase.isValid = true;
                    } else {
                        passwordIsvalid.lowercase.isValid = false;
                    }

                    // Validate capital letters
                    var upperCaseLetters = /[A-Z]/g;
                    if (password.match(upperCaseLetters)) {
                        passwordIsvalid.uppercase.isValid = true;
                    } else {
                        passwordIsvalid.uppercase.isValid = false;
                    }

                    // Validate numbers
                    var numbers = /[0-9]/g;
                    if (password.match(numbers)) {
                        passwordIsvalid.number.isValid = true;
                    } else {
                        passwordIsvalid.number.isValid = false;
                    }

                    // Validate length
                    if (password.length >= 8 && password.length <= 15) {
                        passwordIsvalid.length.isValid = true;
                    } else {
                        passwordIsvalid.length.isValid = false;
                    }

                    // Validate special characters
                    if (/[#[\]()@$&*!?|,.^/\+_-]/.test(password)) {
                        passwordIsvalid.specialChar.isValid = true;
                    } else {
                        passwordIsvalid.specialChar.isValid = false;
                    }

                    return passwordIsvalid;
                }
            });

            function preventSpaceKeypress(e) {
                //for this to work we must have keydown event or keypress
                if (e.keyCode === 32) {
                    e.preventDefault();
                }
            }

            /**
             * Strip html tags from string
             * @param {string} htmlStr - string to strip html tags from
             * @returns {string} - stripped string
             */
            function escape(htmlStr) {
                return htmlStr.replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");

            }

            function checkFormValidity(){
                $(successMessage).removeClass('show');
                if(isValidForm.email && isValidForm.password){
                    $(formButton).removeAttr('disabled');
                }else{
                    $(formButton).attr('disabled', true);
                }
            }
        }
    }
});