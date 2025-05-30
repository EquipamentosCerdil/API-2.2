
import requests
import sys
from datetime import datetime, timedelta
import json

class MedicalEquipmentAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.equipment_id = None
        self.maintenance_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
                
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.text}")
                    return False, response.json()
                except:
                    return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_login(self, username, password):
        """Test login and get token"""
        print(f"\n🔑 Testing login with {username}/{password}...")
        
        url = f"{self.base_url}/api/login"
        data = {"username": username, "password": password}
        
        try:
            # FastAPI expects form data for OAuth2 password flow
            response = requests.post(
                url, 
                data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if response.status_code == 200:
                self.tests_passed += 1
                print(f"✅ Login successful - Status: {response.status_code}")
                response_data = response.json()
                self.token = response_data.get('access_token')
                return True, response_data
            else:
                print(f"❌ Login failed - Status: {response.status_code}")
                print(f"Response: {response.text}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Login failed - Error: {str(e)}")
            return False, {}

    def test_invalid_login(self, username, password):
        """Test login with invalid credentials"""
        print(f"\n🔑 Testing invalid login with {username}/{password}...")
        
        url = f"{self.base_url}/api/login"
        data = {"username": username, "password": password}
        
        try:
            response = requests.post(
                url, 
                data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if response.status_code == 401:
                self.tests_passed += 1
                print(f"✅ Invalid login test passed - Status: {response.status_code}")
                return True, {}
            else:
                print(f"❌ Invalid login test failed - Expected 401, got {response.status_code}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Invalid login test failed - Error: {str(e)}")
            return False, {}

    def test_get_user_info(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get User Info",
            "GET",
            "api/me",
            200
        )
        return success, response

    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success, response

    def test_create_equipment(self, name, model, manufacturer, serial, location):
        """Test creating a new equipment"""
        data = {
            "nome": name,
            "modelo": model,
            "fabricante": manufacturer,
            "numero_serie": serial,
            "localizacao": location,
            "status": "operacional"
        }
        
        success, response = self.run_test(
            "Create Equipment",
            "POST",
            "api/equipamentos",
            201,
            data=data
        )
        
        if success and 'equipamento' in response:
            self.equipment_id = response['equipamento'].get('id')
            print(f"Created equipment with ID: {self.equipment_id}")
        
        return success, response

    def test_list_equipment(self):
        """Test listing all equipment"""
        success, response = self.run_test(
            "List Equipment",
            "GET",
            "api/equipamentos",
            200
        )
        
        if success:
            equipment_count = len(response.get('equipamentos', []))
            print(f"Found {equipment_count} equipment items")
        
        return success, response

    def test_create_maintenance(self, equipment_id, maintenance_type, description, days_from_now=7):
        """Test creating a new maintenance"""
        future_date = (datetime.now() + timedelta(days=days_from_now)).strftime('%Y-%m-%d')
        
        data = {
            "equipamento_id": equipment_id,
            "tipo": maintenance_type,
            "descricao": description,
            "data_prevista": future_date,
            "status": "pendente"
        }
        
        success, response = self.run_test(
            "Create Maintenance",
            "POST",
            "api/manutencoes",
            201,
            data=data
        )
        
        if success and 'manutencao' in response:
            self.maintenance_id = response['manutencao'].get('id')
            print(f"Created maintenance with ID: {self.maintenance_id}")
        
        return success, response

    def test_list_maintenance(self):
        """Test listing all maintenance records"""
        success, response = self.run_test(
            "List Maintenance",
            "GET",
            "api/manutencoes",
            200
        )
        
        if success:
            maintenance_count = len(response.get('manutencoes', []))
            print(f"Found {maintenance_count} maintenance records")
        
        return success, response

    def test_get_reports(self):
        """Test getting reports"""
        success, response = self.run_test(
            "Get Reports",
            "GET",
            "api/relatorios",
            200
        )
        
        if success and 'relatorio' in response:
            print(f"Report data: {json.dumps(response['relatorio'], indent=2)}")
        
        return success, response

    def test_get_notifications(self):
        """Test getting notifications"""
        success, response = self.run_test(
            "Get Notifications",
            "GET",
            "api/notificacoes",
            200
        )
        
        if success:
            notification_count = len(response.get('notificacoes', []))
            print(f"Found {notification_count} notifications")
        
        return success, response

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://e998391d-a760-4c67-a3df-729cd6e23151.preview.emergentagent.com"
    
    print(f"🏥 Testing Medical Equipment Management API at {backend_url}")
    
    # Setup tester
    tester = MedicalEquipmentAPITester(backend_url)
    
    # Test 1: Login with valid credentials
    success, _ = tester.test_login("admin", "admin")
    if not success:
        print("❌ Login failed, stopping tests")
        return 1
    
    # Test 2: Get user info
    success, user_info = tester.test_get_user_info()
    if success:
        print(f"User info: {json.dumps(user_info, indent=2)}")
    
    # Test 3: Health check
    tester.test_health_check()
    
    # Test 4: Create equipment
    success, _ = tester.test_create_equipment(
        "Desfibrilador DEA-300", 
        "DEA-300", 
        "Philips", 
        "SN12345678", 
        "Sala de Emergência"
    )
    
    # Test 5: List equipment
    tester.test_list_equipment()
    
    # Test 6: Create maintenance
    if tester.equipment_id:
        tester.test_create_maintenance(
            tester.equipment_id,
            "preventiva",
            "Manutenção preventiva semestral",
            7  # 7 days from now
        )
    
    # Test 7: List maintenance
    tester.test_list_maintenance()
    
    # Test 8: Get reports
    tester.test_get_reports()
    
    # Test 9: Get notifications
    tester.test_get_notifications()
    
    # Test 10: Invalid login
    tester.test_invalid_login("admin", "wrongpassword")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
