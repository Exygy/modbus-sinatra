class MyApp < Sinatra::Base

  get '/' do
    slim :index
  end

  post '/test' do

    puts "RECIEVED POST!"
    puts params

    ip_address = params[:ip_address]
    port = params[:port].empty? ? 502 : params[:port]
    slave = params[:slave].empty? ? 1 : params[:slave]
    register_1 = params[:register_1].empty? ? 1 : params[:register_1]
    register_2 = params[:register_2].empty? ? 2 : params[:register_2]

    result = {}

    case params[:connection]
    when 'tcp'
      modbusClient = ModBus::TCPClient
    when 'rtu'
      modbusClient = ModBus::RTUViaTCPClient
    end

    begin
      modbusClient.new(ip_address, port) do |cl|
        cl.with_slave(slave_val) do |slave|
          slave.debug = true
          # Read holding registers
          result[:success] = true
          result[:values] = slave.holding_registers[register1..register2]
        end
      end      
    rescue Exception => e
      result[:errors] = e.message
    end

    content_type :json
    result.to_json

  end

end


